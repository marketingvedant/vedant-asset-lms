import CourseForm from '../course-form'

export default function NewCoursePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
        <p className="text-muted-foreground">
          Fill in the details to create a new course
        </p>
      </div>

      <CourseForm />
    </div>
  )
}