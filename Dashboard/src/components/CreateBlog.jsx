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
  // const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState([])
  const [coverImage, setCoverImage] = useState(null)


  const handleAddSection = (type) => {
    setSections((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type,
        value: "",
        file: null,
        ...(type === "image" ? { subtitle: "" } : {}),
      },
    ])
  }

  const handleChange = (id, value, file = null, subtitle = null) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
            ...s,
            value: value !== undefined ? value : s.value,
            file: file !== null ? file : s.file,
            ...(subtitle !== null ? { subtitle } : {}),
          }
          : s
      )
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

  const applyFormatting = (id, type) => {
    const textarea = document.getElementById(id)
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textarea.value.slice(start, end)
    let formatted = selected

    switch (type) {
      case "h1":
        formatted = `# ${selected}`
        break
      case "h2":
        formatted = `## ${selected}`
        break
      case "bold":
        formatted = `**${selected}**`
        break
      case "italic":
        formatted = `*${selected}*`
        break
      case "link":
        const url = prompt("Enter URL for the link:")
        if (url) {
          formatted = `[${selected || 'click'}](${url})`
        } else {
          toast.error("URL is required for links.")
          return
        }
        break
    }

    const updatedValue =
      textarea.value.slice(0, start) +
      formatted +
      textarea.value.slice(end)

    handleChange(id, updatedValue)

    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start
      textarea.selectionEnd = start + formatted.length
    }, 0)
  }

  const handleSearchTags = async () => {
    try {
      const response = await axios.get(`${api}/getTags?search=${tagInput}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      if (response.status === 200) {
        setResults(response.data)
      } else {
        toast.error("Failed to fetch tags. Please try again.")
      }
    }
    catch (err) {
      console.log(err)
      toast.error("Failed to fetch tags. Please try again.")
    }
  }

  useEffect(() => {
    const delayDebouce = setTimeout(() => {
      if (tagInput.trim()) {
        handleSearchTags()
      }
    }, 500);

    return () => clearTimeout(delayDebouce)
  }, [tagInput])


  const handleSubmit = async () => {
    if (tags.length === 0) {
      toast.error("Please add at least one tag.")
      return
    }
    const formData = new FormData()
    if (coverImage) {
      formData.append("coverImage", coverImage)
    }

    const sectionsData = []

    for (const section of sections) {
      if (section.type === "image" && section.file) {
        formData.append("images", section.file, section.file.name)
        sectionsData.push({
          type: "image",
          value: section.file.name,
          subtitle: section.subtitle || "",
        })
      } else {
        sectionsData.push({
          type: section.type,
          value: section.value,
        })
      }
    }

    formData.append("sections", JSON.stringify(sectionsData))
    formData.append("tagsIds", JSON.stringify(tags));

    try {
      setLoading(true)
      const response = await axios.post(`${api}/createBlog`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })

      toast.success("Blog submitted successfully!")
    } catch (error) {
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
                            />
                          </>
                        )}

                        {section.type === "excerpt" && (
                          <>
                            <Label>Excerpt</Label>
                            <Textarea
                              rows={3}
                              maxLength={150}
                              value={section.value}
                              placeholder="Enter excerpt (max 150 characters)"
                              onChange={(e) =>
                                handleChange(section.id, e.target.value)
                              }
                            />
                          </>
                        )}

                        {section.type === "content" && (
                          <>
                            <Label>Content</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => applyFormatting(section.id, "h1")}
                              >
                                H1
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => applyFormatting(section.id, "h2")}
                              >
                                H2
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => applyFormatting(section.id, "bold")}
                              >
                                Bold
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => applyFormatting(section.id, "italic")}
                              >
                                Italic
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => applyFormatting(section.id, "link")}
                              >
                                Link
                              </Button>
                            </div>

                            <Textarea
                              id={section.id}
                              rows={8}
                              placeholder="Write your blog content..."
                              value={section.value}
                              onChange={(e) =>
                                handleChange(section.id, e.target.value)
                              }
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
                                  section.value,
                                  e.target.files[0],
                                  section.subtitle
                                )
                              }
                            />
                            {section.file && (
                              <img
                                src={URL.createObjectURL(section.file)}
                                alt="Preview"
                                className="mt-2 h-48 w-full rounded-md border object-cover"
                              />
                            )}

                            <div className="mt-2">
                              <Label>Image Subtitle</Label>
                              <Input
                                type="text"
                                placeholder="Enter image subtitle"
                                value={section.subtitle || ""}
                                onChange={(e) =>
                                  handleChange(
                                    section.id,
                                    section.value,
                                    section.file,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
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
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2 relative">
            <Input
              id="tags"
              placeholder="Enter tag and press Enter"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagInput.trim()) {
                  e.preventDefault();
                  if (!tags.includes(tagInput.trim())) {
                    setTags([...tags, tagInput.trim()]);
                  }
                  setTagInput("");
                }
              }}
            />
            {tagInput && results.length > 0 && (
              <ul className="absolute z-10 top-full bg-white border rounded shadow mt-1 w-full flex flex-wrap gap-2 p-2">
                {results.map((tag) => (
                  <li
                    key={tag._id}
                    className="px-3 py-1 bg-gray-200 text-sm rounded-full cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      if (!tags.includes(tag.name)) {
                        setTags((prev) => [...prev, tag.name]);
                      }
                      setTagInput(""); // input cleared
                    }}
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-sm bg-gray-200 rounded-full flex items-center"
              >
                {tag}
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => {
                    setTags((prev) => prev.filter((t) => t !== tag));
                  }}
                >
                  &times;
                </button>
              </span>
            ))}
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


