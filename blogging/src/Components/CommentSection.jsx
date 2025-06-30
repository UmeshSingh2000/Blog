import { useEffect, useState } from "react"

export default function CommentSection({ blogId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock comments data - replace with actual API call
  useEffect(() => {
    // Simulate loading comments
    setComments([
      {
        id: 1,
        author: 'John Doe',
        content: 'Great article! Really insightful perspective on architecture.',
        createdAt: new Date().toISOString(),
        replies: []
      },
      {
        id: 2,
        author: 'Jane Smith',
        content: 'I love the way you explained the concepts. Looking forward to more posts like this.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        replies: [
          {
            id: 3,
            author: 'Mike Johnson',
            content: 'I agree! The examples were very clear.',
            createdAt: new Date(Date.now() - 43200000).toISOString()
          }
        ]
      },
      
    ])
  }, [blogId])

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!newComment.trim() || !authorName.trim()) return

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const comment = {
        id: Date.now(),
        author: authorName,
        content: newComment,
        createdAt: new Date().toISOString(),
        replies: []
      }
      
      setComments(prev => [comment, ...prev])
      setNewComment('')
      setAuthorName('')
      setLoading(false)
    }, 500)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
            rows="3"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                {comment.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                
                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 ml-4 space-y-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                          {reply.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{reply.author}</span>
                            <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8 text-sm">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}