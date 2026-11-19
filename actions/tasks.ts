"use server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { asc,eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTasks() {
  const allTasks = await db.select().from(tasks).orderBy(asc(tasks.id));
  return allTasks;
}

export async function addTaskAction(data:{title:string,priority:string,dueDate:string}){
    const newTask = await db.insert(tasks).values({
        title:data.title,
        priority:data.priority,
        dueDate:data.dueDate,
        completed:false,
    }).returning();
    revalidatePath('/');
    return newTask[0]; 
}

// ✅ ADD ONLY THIS - Baby Brick 4!
export async function deleteTaskAction(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath("/");
}

// ✅ ADD ONLY THIS - Baby Brick 5!
export async function toggleTaskAction(id: number, completed: boolean) {
  const newStatus = completed ? "done" : "todo";
  await db.update(tasks).set({ completed, status: newStatus }).where(eq(tasks.id, id));
}

// ✅ ADD ONLY THIS - Baby Brick 6 - LAST ONE!
export async function editTaskAction(id: number, data: { title: string, priority: string, dueDate: string }) {
  await db.update(tasks).set(data).where(eq(tasks.id, id));
  revalidatePath("/");
}

export async function updateStatusAction(id: number, newStatus: string) {
  const isDone = newStatus === "done";
  await db.update(tasks).set({ status: newStatus, completed: isDone }).where(eq(tasks.id, id));
}