'use client'

import React, { FormEvent, useState } from "react";

export default function DevicesPage() {
    const [id, setId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [availability, setAvailability] = useState<string>('');
    const [limit, setLimit] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = { id, name, description, availability, limit };

        try {
            const response = await fetch("http://localhost:8000/devices", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    return (
        <div className="flex h-screen w-full">
            <main className="w-full p-8 bg-blue-100 rounded-lg">
                <h1 className="text-xl font-bold mb-4">Manage Devices</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="id" className="block text-sm font-medium text-gray-700">ID</label>
                        <input
                            type="text"
                            id="id"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                        <input
                            type="text"
                            id="availability"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="limit" className="block text-sm font-medium text-gray-700">Limit</label>
                        <input
                            type="text"
                            id="limit"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </main>
        </div>
    );
}
