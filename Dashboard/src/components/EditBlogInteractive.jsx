import React, { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import Loader from "./Loader/Loader"

const api = import.meta.env.VITE_BACKEND_URL

const sectionOptions = [
  { type: "title", label: "Title" },
  { type: "excerpt", label: "Excerpt" },
  { type: "content", label: "Content" },
  { type: "image", label: "Image" },
]

const EditBlogInteractive = () => {
  const navigate = useNavigate()
  const { blogId } = useParams()

  const [results, setResults] = useState([])
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [sections, setSections] = useState([])
  const [coverImage, setCoverImage] = useState(null)
  const [existingCoverImage, setExistingCoverImage] = useState(null)
  const [coverSubtitle, setCoverSubtitle] = useState("")
  const [blogData, setBlogData] = useState(null)

  // Load existing blog data
  const loadBlogData = async () => {
    try {
      setInitialLoading(true)
      const response = await axios.get(`${api}/getBlog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })

      if (response.status === 200) {
        const blog = response.data.blog || response.data // Handle both formats
        setBlogData(blog)

        // Set existing cover image
        if (blog.coverImage) {
          setExistingCoverImage(blog.coverImage)
        }
        if (blog.coverImage.subtitle) {
          setCoverSubtitle(blog.coverImage.subtitle)
        }

        // Set tags
        if (blog.tags && Array.isArray(blog.tags)) {
          setTags(blog.tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag._id))
        }

        // Initialize sections array
        let loadedSections = []

        // First add the title section
        loadedSections.push({
          id: `title-${Date.now()}`,
          type: "title",
          value: blog.title || ""
        })

        // Then add the excerpt section
        loadedSections.push({
          id: `excerpt-${Date.now()}`,
          type: "excerpt",
          value: blog.excerpt || ""
        })

        // Then handle the content sections
        if (Array.isArray(blog.content)) {
          // If content is an array of sections, add them all
          blog.content.forEach((section, index) => {
            loadedSections.push({
              id: section.id || `content-${index}-${Date.now()}`,
              type: section.type || "content",
              value: section.value || "",
              ...(section.subtitle && { subtitle: section.subtitle })
            })
          })
        } else if (typeof blog.content === 'string') {
          // If content is just a string, create one content section
          loadedSections.push({
            id: `content-${Date.now()}`,
            type: "content",
            value: blog.content
          })
        }

        // Add any other sections that might exist in the blog data
        if (Array.isArray(blog.sections)) {
          blog.sections.forEach((section, index) => {
            // Skip if we already have this section type
            if (!['title', 'excerpt'].includes(section.type)) {
              loadedSections.push({
                id: section.id || `section-${index}-${Date.now()}`,
                type: section.type,
                value: section.value || "",
                ...(section.subtitle && { subtitle: section.subtitle }),
                ...(section.file && { file: null }) // Reset file
              })
            }
          })
        }

        setSections(loadedSections)

        toast.success("Blog loaded successfully!", {
          position: "bottom-center",
          icon: "📝",
        })
      }
    } catch (error) {
      console.error("Error loading blog:", error)
      toast.error("Failed to load blog data")
    } finally {
      setInitialLoading(false)
    }
  }
  useEffect(() => {
    if (blogId) {
      loadBlogData()
    }
  }, [blogId])

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
    if (file) {
      setCoverImage(file)
      setExistingCoverImage(null) // Clear existing image when new one is selected
    }
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
      toast.error("Please add at least one tag.");
      return;
    }

    const formData = new FormData();

    // Add new cover image if selected
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    if (coverSubtitle) {
      formData.append("coverImageSubtitle", coverSubtitle)
    }

    // Prepare sections data (no need to separate existing/new images in frontend)
    const sectionsData = sections.map(section => {
      const baseSection = {
        id: section.id,
        type: section.type,
        subtitle: section.subtitle?.trim() || ""
      };

      if (section.type === "image") {

        if (section.file instanceof File) {
          formData.append("images", section.file);

          baseSection.file = section.file.name;
          baseSection.value = section.file.name; // ✅ MUST overwrite empty value here

        } else if (section.value) {
          baseSection.value = section.value;
        } else {
          baseSection.value = "";
        }
      } else {
        baseSection.value = section.value?.trim() || "";
      }

      return baseSection;
    });


    // Add all data to formData
    formData.append("sections", JSON.stringify(sectionsData));
    formData.append("tagsIds", JSON.stringify(tags));

    try {
      setLoading(true);
      const response = await axios.put(`${api}/updateBlog/${blogData._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        toast.success("Blog updated successfully!");
        // Optionally redirect or refresh data
        navigate(`/dashboard`);
      } else {
        throw new Error(response.data.message || "Failed to update blog");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasTitle = sections.some((s) => s.type === "title")
  const hasExcerpt = sections.some((s) => s.type === "excerpt")

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl mb-5 font-bold text-center">Edit Blog</h1>
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
            <div className="relative">
              <img
                src={URL.createObjectURL(coverImage)}
                alt="New Cover Preview"
                className="mt-2 h-52 w-full rounded-md object-cover border"
              />
              <p className="text-sm text-green-600 mt-1">New cover image selected</p>
            </div>
          )}
          {existingCoverImage && !coverImage && (
            <div className="relative">
              <img
                src={
                  existingCoverImage?.startsWith?.('http')
                    ? existingCoverImage
                    : existingCoverImage?.url?.startsWith?.('http')
                      ? existingCoverImage.url
                      : `${api}/uploads/${existingCoverImage?.url || existingCoverImage}`
                }
                alt="Current Cover"
                className="mt-2 h-52 w-full rounded-md object-cover border mb-2"
              />

              <Label htmlFor="coverSubtitle" className="mt-3 mb-2" >Cover Image Subtitle</Label>
              <Input
                id="coverSubtitle"
                type="text"
                value={coverSubtitle}
                onChange={(e) => setCoverSubtitle(e.target.value)}
              />
            </div>
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
                              value={section.value}
                              placeholder="Enter excerpt"
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
                              <div className="relative">
                                <img
                                  src={URL.createObjectURL(section.file)}
                                  alt="New Image Preview"
                                  className="mt-2 h-48 w-full rounded-md border object-cover"
                                />
                                <p className="text-sm text-green-600 mt-1">New image selected</p>
                              </div>
                            )}
                            {section.value && !section.file && (
                              <div className="relative">
                                <img
                                  src={section.value.startsWith('http') ? section.value : `${api}/uploads/${section.value}`}
                                  alt="Current Image"
                                  className="mt-2 h-48 w-full rounded-md border object-cover"
                                />
                                <p className="text-sm text-gray-600 mt-1">Current image</p>
                              </div>
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

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
          {loading ? (
            <Button className="flex-1" disabled>
              Updating...
            </Button>
          ) : (
            sections.length > 0 && (
              <Button className="flex-1 cursor-pointer" onClick={handleSubmit}>
                Update Blog
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default EditBlogInteractive