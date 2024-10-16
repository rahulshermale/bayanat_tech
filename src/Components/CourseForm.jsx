import React, { useState, useEffect } from 'react';

function CourseCRUD() {
    const API_URL = 'http://localhost:8080/api/courses';

    const [courses, setCourses] = useState([]);

    const [formData, setFormData] = useState({
        courseName: '',
        courseId: '',
        address: '',
        rate: '',
        qty: '',
        amount: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);

    const fetchCourses = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        const temp = ["qty", "rate"]
      

        setFormData((prevData) => (
            {
                ...prevData,
                [name]: value,
                ...(temp.includes(name) && { amount: name === "qty" ? prevData.rate * value : prevData.qty * value })
            }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            try {
                await fetch(`${API_URL}/${editingCourseId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                setIsEditing(false);
                setEditingCourseId(null);
            } catch (error) {
                console.error("Error updating course:", error);
            }
        } else {
            try {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } catch (error) {
                console.error("Error adding course:", error);
            }
        }
        setFormData({ courseName: '', courseId: '', address: '', rate: '', qty: '', amount: '' });
        fetchCourses();
    };

    // Handle course edit
    const handleEdit = (course) => {
        setFormData(course);
        setIsEditing(true);
        setEditingCourseId(course.id);
    };

    const handleDelete = async (courseId) => {
        try {
            await fetch(`${API_URL}/${courseId}`, {
                method: 'DELETE',
            });
            fetchCourses();
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    return (
        <div className='w-full bg-slate-900'>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-400 pt-40">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mb-8">
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        {isEditing ? 'Edit Course' : 'Add New Course'}
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className='flex flex-wrap'>
                            <label htmlFor="courseName" className="block text-gray-700">
                                Course Name:
                            </label>
                            <input
                                type="text"
                                id="courseName"
                                name="courseName"
                                value={formData.courseName}
                                onChange={handleChange}
                                className="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className='flex flex-wrap'>
                            <label htmlFor="courseId" className="block text-gray-700">
                                Course ID:
                            </label>
                            <input
                                type="text"
                                id="courseId"
                                name="courseId"
                                value={formData.courseId}
                                onChange={handleChange}
                                className="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className='flex flex-wrap'>
                            <label htmlFor="rate" className="block text-gray-700">
                                Rate :
                            </label>
                            <input
                                type="number"
                                id="rate"
                                name="rate"
                                value={formData.rate}
                                onChange={handleChange}
                                className="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className='flex flex-wrap'>
                            <label htmlFor="qty" className="block text-gray-700">
                                QTY :
                            </label>
                            <input
                                type="number"
                                id="qty"
                                name="qty"
                                value={formData.qty}
                                onChange={handleChange}
                                className="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className='flex flex-wrap'>
                            <label htmlFor="amount" className="block text-gray-700">
                                Amount :
                            </label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                readOnly // Make this field read-only
                                className="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className='flex flex-wrap'>
                            <label htmlFor="address" className="block text-gray-700">
                                Address :
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            {isEditing ? 'Update Course' : 'Add Course'}
                        </button>
                    </form>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md my-40">
                    <h2 className="text-xl font-bold mb-4 text-center">Course List</h2>
                    {courses.length === 0 ? (
                        <p className="text-center text-gray-500">No courses available.</p>
                    ) : (
                        <ul>
                            {courses.map((course, index) => (
                                <li
                                    key={course.id}
                                    className="flex justify-between items-start mb-4 p-4 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-semibold text-black">Name: {course.courseName}</p>
                                        <p className="text-sm text-gray-900">ID: {course.courseId}</p>
                                        <p className="text-sm text-gray-900">Address: {course.address}</p>
                                        <p className="text-sm text-gray-900">Rate: {course.rate}</p>
                                        <p className="text-sm text-gray-900">QTY: {course.qty}</p>
                                        <p className="text-sm text-gray-900">Amount: {course.amount}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(course)}
                                            className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course.id)}
                                            className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseCRUD;
