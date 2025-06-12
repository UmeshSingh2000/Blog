import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ImageCard = () => {
  return (
    <Card className="w-full max-w-sm shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="p-0">
        <img
          src="https://source.unsplash.com/random/800x600?nature"
          alt="Card Cover"
          className="h-56 w-full object-cover"
        />
      </CardHeader>

      <CardContent className="p-4">
        <CardTitle className="text-xl font-semibold">Beautiful Nature</CardTitle>
        <p className="text-gray-500 mt-2">
          Explore the stunning beauty of nature through vibrant landscapes and serene views.
        </p>
      </CardContent>

      <CardFooter className="p-4">
        <Button className="w-full">Read More</Button>
      </CardFooter>
    </Card>
  )
}

export default ImageCard
