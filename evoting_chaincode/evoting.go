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
	"strconv"
	"encoding/json"
	"time"
	"strings"
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

type Election struct {
	Id string `json:"id"`
	Name string `json:"name"`
	Question string `json:"question"`
	Options []Option  `json:"options"`
	Tokens []string `json:"tokens"`
	Votes []Vote `json:"vote"`
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

//	err := stub.PutState("hello_world", []byte(args[0]))
//	if err != nil {
//		return nil, err
//	}

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
	}
	fmt.Println("invoke did not find func: " + function)

	return nil, errors.New("Received unknown function invocation")
}

// Query is our entry point for queries
func (t *SimpleChaincode) Query(stub *shim.ChaincodeStub, function string, args []string) ([]byte, error) {
	fmt.Println("query is running " + function)

	// Handle different functions
	// if function == "read" {                            //read a variable
	// 	return t.read(stub, args)
	// }
	fmt.Println("query did not find func: " + function)

	return nil, errors.New("Received unknown function query")
}

func (t *SimpleChaincode) createElection(stub *shim.ChaincodeStub, args []string) ([]byte, error) {
	if len(args) != 1 {
			fmt.Println("error invalid arguments")
			return nil, errors.New("Incorrect number of arguments. Expecting election record")
		}

		var election Election
		var err error

		fmt.Println("Unmarshalling Election");
		err = json.Unmarshal([]byte(args[0]), &election)
		if err != nil {
			fmt.Println("error election")
			return nil, errors.New("Invalid election")
		}

		electionWriteBytes, err := json.Marshal(&election)
		if err != nil {
			fmt.Println("Error marshalling election");
			return nil, errors.New("Error creating election")
		}

		err = stub.PutState(election.Id, electionWriteBytes)

		if err != nil {
			fmt.Println("Error creating election");
			return nil, errors.New("Error creating election")
		}

		return nil, nil
}

func (t *SimpleChaincode) vote(stub *shim.ChaincodeStub, args []string) ([]byte, error) {
  // strings
	return nil, nil
}
