package common

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/RediSearch/redisearch-go/redisearch"
)

var ctx = context.Background()
var client *redisearch.Client

type Document struct {

	// ResourceID of resource to query
	ResourceID string `json:"resource_id"`

	// Type of resource
	Type string `json:"type"`

	// Section where resource is located
	Section string `json:"section"`

	// Language (IETF IOS language tag) of the resource to return
	Language string `json:"language"`

	// Retailer of resource to query
	Retailer string `json:"retailer"`

	// Store of resource to query
	Store string `json:"store"`

	// Endpoint of resource to query
	Endpoint string `json:"endpoint"`

	// Valus of resource to query
	Value string `json:"value"`
}
type Documents struct {
	Id      string   `json:"Id"`
	Payload Document `json:"Properties"`
}

func InitRedis() {
	client = redisearch.NewClient("localhost:6379", "search-client")
	fmt.Println("Connected to Redis")
}

func SearchIndex(indexName, query string) []Documents {
	docs, _, err := client.Search(redisearch.NewQuery(query))
	if err != nil {
		fmt.Println("Error querying redis", err)
		return nil
	}
	fmt.Println("check totals: ", docs[0])
	for _, doc := range docs {
		fmt.Println(doc.Id, doc.Properties)
	}
	var doc []Documents
	byteDoc, _ := json.Marshal(docs)
	json.Unmarshal(byteDoc, &doc)
	fmt.Printf("We have received: %v", doc)
	return doc
}
