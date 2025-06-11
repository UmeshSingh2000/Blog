import React, { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import axios from "axios"

const api = import.meta.env.VITE_BACKEND_URL

const sectionOptions = [
  { type: "title", label: "Title" },
  { type: "excerpt", label: "Excerpt" },
  { type: "content", label: "Content" },
  { type: "image", label: "Image" },
]

const CreateBlogInteractive = () => {
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState([])
  const [coverImage, setCoverImage] = useState(null)

  useEffect(() => {
    toast.success("Create a New Blog!", {
      position: "bottom-center",
      icon: "👏",
    })
  }, [])

  const handleAddSection = (type) => {
    setSections((prev) => [
      ...prev,
      { id: Date.now().toString(), type, value: "", file: null },
    ])
  }

  const handleChange = (id, value, file = null) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value, file } : s))
    )
  }

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setCoverImage(file)
  }

  const handleDelete = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }

  const onDragEnd = (result) => {
    if (!result.destination) return
    const reordered = Array.from(sections)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)
    setSections(reordered)
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    if (coverImage) {
      formData.append("coverImage", coverImage)
    }

    const sectionsData = []

    for (const section of sections) {
      if (section.type === "image" && section.file) {
        formData.append("images", section.file, section.file.name)
        sectionsData.push({ type: "image", value: section.file.name })
      } else {
        sectionsData.push({ type: section.type, value: section.value })
      }
    }

    formData.append("sections", JSON.stringify(sectionsData))

    try {
      setLoading(true)
      const response = await axios.post(`${api}/createBlog`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })

      console.log("Blog created:", response.data)
      toast.success("Blog submitted successfully!")
    } catch (error) {
      console.log("Submit error:", error.response?.data || error.message)
      toast.error("Failed to submit blog. Please try again.")
    } finally {
      setLoading(false)
      setSections([])
      setCoverImage(null)
    }
  }

  const hasTitle = sections.some((s) => s.type === "title")
  const hasExcerpt = sections.some((s) => s.type === "excerpt")

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl mb-5 font-bold text-center">Create a New Blog</h1>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image</Label>
          <Input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
          />
          {coverImage && (
            <img
              src={URL.createObjectURL(coverImage)}
              alt="Cover Preview"
              className="mt-2 h-52 w-full rounded-md object-cover border"
            />
          )}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {sections.map((section, index) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-4 border rounded-md bg-gray-50 relative"
                      >
                        <button
                          onClick={() => handleDelete(section.id)}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                          aria-label="Delete section"
                          title="Delete section"
                        >
                          ✕
                        </button>

                        {section.type === "title" && (
                          <>
                            <Label>Title</Label>
                            <Input
                              placeholder="Enter title"
                              value={section.value}
                              onChange={(e) =>
                                handleChange(section.id, e.target.value)
                              }
                              required
                            />
                          </>
                        )}

                        {section.type === "excerpt" && (
                          <>
                            <Label>Excerpt (max 150 characters)</Label>
                            <Textarea
                              rows={3}
                              maxLength={150}
                              placeholder="Short blog summary"
                              value={section.value}
                              onChange={(e) =>
                                handleChange(section.id, e.target.value)
                              }
                            />
                          </>
                        )}

                        {section.type === "content" && (
                          <>
                            <Label>Content</Label>

                            {/* Formatting buttons */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  handleChange(
                                    section.id,
                                    section.value + "\n# Heading 1"
                                  )
                                }
                              >
                                H1
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  handleChange(
                                    section.id,
                                    section.value + "\n## Heading 2"
                                  )
                                }
                              >
                                H2
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  handleChange(
                                    section.id,
                                    section.value + " **bold**"
                                  )
                                }
                              >
                                Bold
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  handleChange(
                                    section.id,
                                    section.value + " *italic*"
                                  )
                                }
                              >
                                Italic
                              </Button>
                            </div>

                            <Textarea
                              rows={8}
                              placeholder="Write your blog content..."
                              value={section.value}
                              onChange={(e) =>
                                handleChange(section.id, e.target.value)
                              }
                              required
                            />
                          </>
                        )}

                        {section.type === "image" && (
                          <>
                            <Label>Image</Label>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleChange(
                                  section.id,
                                  e.target.value,
                                  e.target.files[0]
                                )
                              }
                            />
                            {section.file && (
                              <img
                                src={URL.createObjectURL(section.file)}
                                alt="Image Preview"
                                className="mt-2 h-48 w-full rounded-md border object-cover"
                              />
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="space-y-2">
          <Label>Add New Section</Label>
          <div className="flex flex-wrap gap-2">
            {sectionOptions.map((opt) => {
              const isDisabled =
                (opt.type === "title" && hasTitle) ||
                (opt.type === "excerpt" && hasExcerpt)
              return (
                <Button
                  key={opt.type}
                  variant="outline"
                  onClick={() => handleAddSection(opt.type)}
                  disabled={isDisabled}
                >
                  + {opt.label}
                </Button>
              )
            })}
          </div>
        </div>

        {loading ? (
          <Button className="w-full mt-6" disabled>
            Submitting...
          </Button>
        ) : (
          sections.length > 0 && (
            <Button className="w-full mt-6" onClick={handleSubmit}>
              Submit Blog
            </Button>
          )
        )}
      </div>
    </div>
  )
}

export default CreateBlogInteractive
