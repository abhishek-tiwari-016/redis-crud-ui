package main

import (
	common "go-backend/redisUtil"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	common.InitRedis()

	index := common.SearchIndex("search-client", `@section:{SCOX}`)
	r.GET("/api/hello", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": index})
	})

	r.Run(":8080")
}
