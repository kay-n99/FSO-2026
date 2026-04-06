const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let max = 0
    let maxBlog = {}
    blogs.forEach(blog => {
        if(blog.likes > max){
            max = blog.likes
            maxBlog = blog
        }
    })
    return maxBlog
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0) return null

    const authorGroups = _.groupBy(blogs, 'author')

    const authorCounts = _.map(authorGroups, (val, key) => ({
        author: key,
        blogs: val.length
    }))

    return _.maxBy(authorCounts, 'blogs')
}

const mostLikes = (blogs) => {
    if(blogs.length === 0 ) return null

    const authorGroups = _.groupBy(blogs, 'author')
    const authorCounts = _.map(authorGroups, (val, key) => {
        return{
            author: key,
            likes: _.sumBy(val, 'likes')
        }
    })

    return _.maxBy(authorCounts, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}