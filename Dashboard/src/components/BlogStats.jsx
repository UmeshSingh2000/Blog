import React from "react"
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Eye,
  Heart,
  MessageCircle,
  BarChart3
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const BlogStats = () => {
  // Dummy data for demonstration
  const stats = {
    totalBlogs: 24,
    publishedBlogs: 18,
    draftBlogs: 6,
    totalViews: 12847,
    totalLikes: 1256,
    totalComments: 342,
    thisMonthBlogs: 5,
    mostPopularBlog: {
      title: "10 Tips for Better Web Development",
      views: 2834,
      likes: 156,
      comments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
      status: "published"
    }
  }



  const statCards = [
    {
      title: "Total Blogs",
      value: stats.totalBlogs,
      icon: BookOpen,
      description: "All your blog posts",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Published",
      value: stats.publishedBlogs,
      icon: TrendingUp,
      description: "Live blog posts",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Drafts",
      value: stats.draftBlogs,
      icon: Calendar,
      description: "Work in progress",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      description: "Across all posts",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      description: "Reader appreciation",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Comments",
      value: stats.totalComments.toLocaleString(),
      icon: MessageCircle,
      description: "Reader engagement",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "This Month",
      value: stats.thisMonthBlogs,
      icon: BarChart3,
      description: "Posts published",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Blog Statistics
        </h2>
        <p className="text-muted-foreground">
          Track your blogging journey and engagement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden transition-all hover:shadow-lg hover:scale-105">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.bgColor.replace('bg-', 'bg-gradient-to-r from-').replace('-50', '-200 to-transparent')}`} />
            </Card>
          )
        })}
      </div>

      {/* Most Popular Blog Card */}
      {stats.mostPopularBlog && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Most Popular Blog
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{stats.mostPopularBlog.title}</h3>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {stats.mostPopularBlog.views || 0} views
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {stats.mostPopularBlog.likes || 0} likes
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {stats.mostPopularBlog.comments?.length || 0} comments
                </div>
              </div>
              {stats.mostPopularBlog.status && (
                <Badge variant="secondary" className="w-fit">
                  {stats.mostPopularBlog.status}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {stats.totalBlogs === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No blogs yet</h3>
            <p className="text-muted-foreground">
              Start writing your first blog post to see your statistics here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BlogStats