package main

import (
	common "go-backend/redisUtil"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	common.InitRedis()

	r.GET("/document/get", func(ctx *gin.Context) {
		index := common.SearchIndex("search-client", `@language:{*US}`)
		ctx.JSON(200, gin.H{"message": index})
	})

	r.POST("/document/update", common.UpdateDocument)

	r.Run(":8080")
}
