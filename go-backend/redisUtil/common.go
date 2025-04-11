package common

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/RediSearch/redisearch-go/v2/redisearch"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	redigo "github.com/gomodule/redigo/redis"
)

var ctx = context.Background()
var searchClient *redisearch.Client
var client *redis.Client

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
	client = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	pool := &redigo.Pool{Dial: func() (redigo.Conn, error) {
		return redigo.Dial("tcp", "localhost:6379")
	}}
	searchClient = redisearch.NewClientFromPool(pool, "search-client")
	fmt.Println("Connected to Redis")
}

func SearchIndex(indexName, query string) []Documents {
	docs, _, err := searchClient.Search(redisearch.NewQuery(query).Limit(0, 100))
	if err != nil {
		fmt.Println("Error querying redis", err)
		return nil
	}
	var doc []Documents
	byteDoc, _ := json.Marshal(docs)
	json.Unmarshal(byteDoc, &doc)
	return doc
}

func UpdateDocument(ctx *gin.Context) {
	var updatedDoc map[string]string

	err := ctx.BindJSON(&updatedDoc)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}

	Id, exists := updatedDoc["Id"]
	if !exists {
		ctx.JSON(400, gin.H{"error": "Missing Id of Doc"})
		return
	}

	delete(updatedDoc, "Id")

	// updating fields in redis for Id
	for key, val := range updatedDoc {
		_, err = client.HSet(Id, key, val).Result()
		if err != nil {
			ctx.JSON(500, gin.H{"error": "Failed to update Redis"})
			return
		}
	}

	_, err = searchClient.AddHash(Id, 1.0, "", false)
	if err != nil {
		fmt.Println("Error re-indexing document", err)
		ctx.JSON(500, gin.H{"error": "Error re-indexing document"})
		return
	}
	ctx.JSON(200, gin.H{"message": "Successfully updated document"})

}
