/*
Copyright IBM Corp 2016 All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package main

import (
	"errors"
	"fmt"
	"sort"
	// "strconv"
	"encoding/json"
	// "time"
	// "strings"
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

type Option struct {
	Id int `json:"id"`
	Name string `json:"name"`
}

type Vote struct {
	Token string `json:"token"`
	OptionId int `json:"optionId"`
	ReceiptId string `json:"receiptId"`
}

type OptionTotal struct {
  Id int `json:"optionId"`
  Total int `json:"total"`
}

type Tally struct {
	VoteCount int `json:"voteCount"`
	OptionTotals []OptionTotal `json:"optionTotal"`
}

type Election struct {
	Id string `json:"id"`
	Name string `json:"name"`
	Question string `json:"question"`
	Options []Option  `json:"options"`
	Tokens []string `json:"tokens"`
	Votes []Vote `json:"vote"`
	Tally Tally `json:"tally"`
	AllowVoting bool `json:"allowVoting"`
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

// Init resets all the things
func (t *SimpleChaincode) Init(stub *shim.ChaincodeStub, function string, args []string) ([]byte, error) {
	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting 1")
	}

	return nil, nil
}

// Invoke isur entry point to invoke a chaincode function
func (t *SimpleChaincode) Invoke(stub *shim.ChaincodeStub, function string, args []string) ([]byte, error) {
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "init" {
		return t.Init(stub, "init", args)
	} else if function == "createElection" {
		return t.createElection(stub, args)
	} else if function == "vote" {
		return t.vote(stub, args)
	} else if function == "tally" {
		return t.tally(stub, args)
	}

	fmt.Println("invoke did not find func: " + function)

	return nil, errors.New("Received unknown function invocation")
}

// Query is our entry point for queries
func (t *SimpleChaincode) Query(stub *shim.ChaincodeStub, function string, args []string) ([]byte, error) {
	fmt.Println("query is running " + function)

	if function == "getElection" {
		election, err := t.getElection(stub, args[0])
		if err != nil {
			return nil, err
		}
		// hide some of the other data
		election.Votes = make([]Vote, 0)
		election.Tokens = make([]string, 0)
		return json.Marshal(&election)
	} else if function == "hasVote" {
		election, err := t.getElection(stub, args[0])
		if err != nil {
			return nil, err
		}
		receiptId := args[1]
		for _,element := range election.Votes {
			if receiptId == element.ReceiptId {
				return json.Marshal("1")
			}
		}
		response, err := json.Marshal("0")
		return response, errors.New("Vote with receipt " + receiptId + " not found")
	}

	fmt.Println("query did not find func: " + function)

	return nil, errors.New("Received unknown function query '" + function + "'")
}

func (t *SimpleChaincode) saveElection(stub *shim.ChaincodeStub, election Election) (error) {

		var err error

		electionWriteBytes, err := json.Marshal(&election)
		if err != nil {
			fmt.Println("Error marshalling election: " + err.Error());
			return errors.New("Error creating election")
		}

		err = stub.PutState(election.Id, electionWriteBytes)

		if err != nil {
			fmt.Println("Error saving election");
			return errors.New("Error saving election")
		}

		return nil
}

func (t *SimpleChaincode) createElection(stub *shim.ChaincodeStub, args []string) ([]byte, error) {
	if len(args) != 1 {
			fmt.Println("error invalid arguments")
			return nil, errors.New("Incorrect number of arguments. Expecting election record")
		}

		var election Election
		var err error

		fmt.Println("Unmarshalling Election")
		err = json.Unmarshal([]byte(args[0]), &election)
		if err != nil {
			fmt.Println("error unmarshalling election")
			return nil, errors.New("Invalid election: " + err.Error())
		}

    election.Tally = Tally{}
    election.AllowVoting = true

		err = t.saveElection(stub, election)

		return nil, err
}

func (t *SimpleChaincode) getElection(stub *shim.ChaincodeStub, electionId string) (Election, error){
	var err error
	var election  Election

	if electionId == "" {
			fmt.Println("error invalid arguments")
			return election, errors.New("Incorrect number of arguments. Expecting electionId record")
	}

	fmt.Println("Getting election state");

	electionBytes, err := stub.GetState(electionId)

  err = json.Unmarshal(electionBytes, &election)
	if err != nil {
		fmt.Println("Error unmarshalling election: " + err.Error());
		return election, errors.New("Error unmarshalling election: " + err.Error())
	}

	return election, nil
}



  func (t *SimpleChaincode) vote(stub *shim.ChaincodeStub, args []string) ([]byte, error) {
	  if len(args) != 2 {
			fmt.Println("error invalid arguments")
			return nil, errors.New("Incorrect number of arguments. Expecting electionId and vote record")
		}

		var vote Vote
		var election Election
		var err error

		election, err = t.getElection(stub, args[0])

    // ensure that voting is allowed
		if !election.AllowVoting {
			return nil, errors.New("Voting is not allowed because tallying has been done")
		}

		fmt.Println("Unmarshalling Vote")
		err = json.Unmarshal([]byte(args[1]), &vote)
		if err != nil {
			fmt.Println("error vote")
			return nil, errors.New("Invalid vote")
		}

		// check for duplicate token
    token := vote.Token
		for _,element := range election.Votes {
			if token == element.Token {
				return nil, errors.New("Duplicate vote attempt detected")
			}
		}

		// check for invalid optionId
		optionId := vote.OptionId
		validOption := false
		if optionId == -1 {
			validOption = true
		}
		for _,element := range election.Options {
			if optionId == element.Id {
				validOption = true
			}
		}
		if !validOption {
			return nil, errors.New("Chosen option is invalid")
		}
		if vote.ReceiptId == "" {
			return nil, errors.New("No ReceiptId provided")
		}

		election.Votes = append(election.Votes, vote)

		election.Tally.VoteCount = election.Tally.VoteCount + 1

		err = t.saveElection(stub, election)

		if err != nil {
			fmt.Println("Error voting");
			return nil, errors.New("Error voting")
		}

		return nil, nil
	}


	  func (t *SimpleChaincode) tally(stub *shim.ChaincodeStub, args []string) ([]byte, error) {

		  if len(args) != 1 {
				fmt.Println("error invalid arguments")
				return nil, errors.New("Incorrect number of arguments. Expecting electionId")
			}

			election, err := t.getElection(stub, args[0])

			tally := Tally{}

			tally.VoteCount = 0
			tally.OptionTotals = make([]OptionTotal, 0)

			counts := make(map[int]int)

      counts[-1] = 0

			for _,element := range election.Options {
				counts[element.Id] = 0
			}

      //
			for _,element := range election.Votes {
				tally.VoteCount = tally.VoteCount + 1
       counts[element.OptionId] = counts[element.OptionId] + 1
			}

			var keys []int
			for k := range counts {
			    keys = append(keys, k)
			}
			sort.Ints(keys)
			for _, k := range keys {
			  tally.OptionTotals = append(tally.OptionTotals, OptionTotal{k, counts[k]})
			}

      election.Tally = tally

			election.AllowVoting = false

			err = t.saveElection(stub, election)

			if err != nil {
				fmt.Println("Error tallying");
				return nil, errors.New("Error tallying")
			}

			return nil, nil
		}
