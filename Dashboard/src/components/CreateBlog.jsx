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
    useEffect(() => {

        toast.success('Create a New Blog!', {
            position: "bottom-center",
            icon: '👏',
        })
    }, [])
    const [sections, setSections] = useState([])
    const [coverImage, setCoverImage] = useState(null)

    // Add a new section block to the page
    const handleAddSection = (type) => {
        setSections((prev) => [
            ...prev,
            { id: Date.now().toString(), type, value: "", file: null },
        ])
    }

    // Handle input change for sections (text or image files)
    const handleChange = (id, value, file = null) => {
        setSections((prev) =>
            prev.map((s) => (s.id === id ? { ...s, value, file } : s))
        )
    }

    // Handle cover image separately
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0]
        if (file) setCoverImage(file)
    }

    // Remove section block
    const handleDelete = (id) => {
        setSections((prev) => prev.filter((s) => s.id !== id))
    }

    // Drag and drop reorder handler
    const onDragEnd = (result) => {
        if (!result.destination) return

        const reordered = Array.from(sections)
        const [removed] = reordered.splice(result.source.index, 1)
        reordered.splice(result.destination.index, 0, removed)

        setSections(reordered)
    }

    // Submit form data
    const handleSubmit = async () => {
        const formData = new FormData()

        // Cover image
        if (coverImage) {
            formData.append("coverImage", coverImage)
        }

        const sectionsData = []

        for (const section of sections) {
            if (section.type === "image" && section.file) {
                const imageKey = `image-${section.id}`
                formData.append("images", section.file, imageKey)
                sectionsData.push({ type: "image", fileKey: imageKey })
            } else {
                sectionsData.push({ type: section.type, value: section.value })
            }
        }

        formData.append("sections", JSON.stringify(sectionsData))

        try {
            const response = await axios.post(`${api}/createBlog`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            })

            console.log("Blog created:", response.data)
            alert("Blog submitted successfully!")
        } catch (error) {
            console.error("Submit error:", error.response?.data || error.message)
            alert("Failed to submit blog.")
        }
    }

    return (
        <div className="min-h-screen bg-white p-8">
            <h1 className="text-3xl mb-5 font-bold text-center">Create a New Blog</h1>
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Cover Image Upload */}
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

                {/* Drag & Drop Section List */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="sections">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
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
                                                {/* Delete button */}
                                                <button
                                                    onClick={() => handleDelete(section.id)}
                                                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                                                    aria-label="Delete section"
                                                    title="Delete section"
                                                >
                                                    ✕
                                                </button>

                                                {/* Render input based on section type */}
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

                {/* Add new section buttons */}
                <div className="space-y-2">
                    <Label>Add New Section</Label>
                    <div className="flex flex-wrap gap-2">
                        {sectionOptions.map((opt) => (
                            <Button
                                key={opt.type}
                                variant="outline"
                                onClick={() => handleAddSection(opt.type)}
                            >
                                + {opt.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                {sections.length > 0 && (
                    <Button className="w-full mt-6" onClick={handleSubmit}>
                        Submit Blog
                    </Button>
                )}
            </div>
        </div>
    )
}

export default CreateBlogInteractive
