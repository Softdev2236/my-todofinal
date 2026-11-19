import { useState } from "react";
import { Righteous } from "next/font/google";
const myFont = Righteous({ weight: "400", subsets: ["latin"] });

interface Props {
    title: string;
    priority: string;
    dueDate: string;
    completed: boolean;
    onDelete: () => void;
    onToggle: () => void;
    onEdit: (data: { title: string, priority: string, dueDate: string }) => void;
}

export default function TaskCard({ title, priority, dueDate, completed, onDelete, onToggle, onEdit }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(title);
    const [editPriority, setEditPriority] = useState(priority);
    const [editDueDate, setEditDueDate] = useState(dueDate);
    const [now] = useState(() => Date.now());

    const getTimeLeft = () => {
        const diff = new Date(dueDate).getTime() - now;
        if (diff < 0) return { text: "Overdue", color: "bg-red-500/30 text-red-300" };
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor(diff / (1000 * 60));
        if (days > 0) return { text: `${days}d left`, color: "bg-green-500/30 text-green-300" };
        if (hours > 0) return { text: `${hours}h left`, color: "bg-yellow-500/30 text-yellow-300" };
        return { text: `${mins}m left`, color: "bg-orange-500/30 text-orange-300" };
    };

    const time = getTimeLeft();
    const priColor = priority === 'high' ? 'bg-red-500/30 text-red-300' : priority === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-green-500/30 text-green-300';

    const handleSave = () => {
        if (!editTitle.trim()) return;
        onEdit({ title: editTitle, priority: editPriority, dueDate: editDueDate });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className={`flex flex-col gap-2 bg-white/10 border border-white/20 p-4 rounded-2xl mt-3 ${myFont.className}`}>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-white/10 border border-white/20 px-3 py-2 rounded-full text-white outline-none" />
                <div className="flex flex-col sm:flex-row gap-2">
                    <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} className="w-full sm:w-auto flex-1 bg-white/10 border border-white/20 px-2 py-2 rounded-full text-white outline-none">
                        <option value="low" className="text-black">Low</option>
                        <option value="medium" className="text-black">Medium</option>
                        <option value="high" className="text-black">High</option>
                    </select>
                    <input type="datetime-local" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="w-full sm:w-auto flex-1 bg-white/10 border border-white/20 px-2 py-2 rounded-full text-white text-sm outline-none" />
                </div>
                <div className="flex gap-2">
                    <button onClick={handleSave} className="flex-1 bg-green-500 text-white px-2 py-1 rounded-full text-sm">Save</button>
                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-white text-black px-4 py-1 rounded-full text-sm">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white/10 border border-white/20 p-3 sm:p-4 rounded-2xl mt-3 ${myFont.className} ${completed ? 'opacity-50' : ''}`}>
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <input type="checkbox" checked={completed} onChange={onToggle} className="w-5 h-5 accent-green-500 cursor-pointer shrink-0 mt-0.5 sm:mt-0" />
                <div className="flex-1 min-w-0">
                    <p className={`text-white text-sm wrap-break-word ${completed ? 'line-through' : ''}`}>{title}
                        <span className={`text- sm:text-xs px-2 py-1 rounded-full ml-2 whitespace-nowrap inline-block mt-1 sm:mt-0 ${priColor}`}>{priority}</span>
                    </p>
                    <p suppressHydrationWarning className="text-xs text-white/50 mt-1">{new Date(dueDate).toLocaleString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-8 sm:ml-3">
                <span className={`text- sm:text-xs px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ${completed ? 'bg-green-500/30 text-green-300' : time.color}`}>{completed ? 'Done' : time.text}</span>
                <button onClick={() => setIsEditing(true)} className="bg-yellow-400 text-black px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm flex-1 sm:flex-none">Edit</button>
                <button onClick={onDelete} className="bg-white text-black px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm flex-1 sm:flex-none">Delete</button>
            </div>
        </div>
    )
}