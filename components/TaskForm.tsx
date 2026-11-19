"use client";
import { useState } from "react";
import { Righteous } from "next/font/google";

const myFont = Righteous({ weight: "400", subsets: ["latin"] });

interface Props {
    onAdd: (data: { title: string, priority: string, dueDate: string }) => void;
}

export default function TaskForm({ onAdd }: Props) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("low");
    const [dueDate, setDueDate] = useState("");

    const handleAdd = () => {
        if (!title.trim()) return;
        if (!dueDate) {
            alert("Please pick date and time!");
            return;
        }
        onAdd({ title, priority, dueDate });
        setTitle("");
        setPriority("low");
        setDueDate("");
    };

    return (
        <div className={`w-full max-w-4xl px-3 sm:px-4 mt-6 ${myFont.className}`}>
            <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-3xl sm:rounded-full">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
                    placeholder="Add new task..."
                    className="w-full sm:flex-1 bg-transparent px-4 py-2 text-white placeholder:text-white/40 outline-none min-w-0"
                />

                {/* Mobile pe 2 cheezein ek line me: Priority + Date */}
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="flex-1 sm:flex-none bg-white/10 border border-white/20 px-2 py-2 rounded-full text-white text-sm outline-none"
                    >
                        <option value="low" className="text-black">Low</option>
                        <option value="medium" className="text-black">Medium</option>
                        <option value="high" className="text-black">High</option>
                    </select>

                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="flex-1 sm:flex-none bg-white/10 border border-white/20 px-2 py-2 rounded-full text-white text-sm outline-none"
                    />
                </div>

                <button
                    onClick={handleAdd}
                    className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold w-full sm:w-auto"
                >
                    Add
                </button>
            </div>
        </div>
    );
}