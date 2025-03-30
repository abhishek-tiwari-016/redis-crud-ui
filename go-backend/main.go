package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()

	r.GET("/api/hello", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "hello from go!!"})
	})

	r.Run(":8080")
}
