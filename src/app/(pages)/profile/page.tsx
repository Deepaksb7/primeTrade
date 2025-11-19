"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Mail, Edit2, Save, X } from 'lucide-react';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const page = () => {
  const {data:session , status} = useSession()
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const router = useRouter()

  const loadProfile = async () => {
    if (!session) return;
    try {
      const res = await axios.get("/api/profile")
      setProfile(res.data)

    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup"); 
    }
  }, [status, router]);

   useEffect(() => {
    if (status === "authenticated") {
      loadProfile();
    }
  }, [status]);

  const handleEditClick = ()=>{
    setEditedName(profile.name)
    setIsEditing(true)
  }

  const handleSaveClick =async ()=>{
    await axios.put("/api/profile/update",{name:editedName})
    setProfile({...profile,name:editedName})
    setIsEditing(false)
  }

  if (!profile) return <p>Loading.....</p>

  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : "??"

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">

      <div className="w-full max-w-lg bg-white rounded-4xl shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl">

        <div className="h-40 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 relative">
        </div>

        <div className="px-8 pb-10">

          <div className="relative -mt-20 mb-6 flex justify-center">
            <div className="p-2 bg-white rounded-full shadow-lg">
              <div className="w-40 h-40 rounded-full bg-linear-to-r from-slate-800 to-slate-900 flex items-center justify-center text-white text-5xl font-bold shadow-inner border border-slate-700">
                {initials}
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-3xl font-bold text-slate-900 text-center border-b-2 border-blue-500 focus:outline-none w-full max-w-[300px] px-2 py-1"
              autoFocus
            />
            ) : (
            <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
            )}


            <div className="flex flex-col items-center gap-2 text-slate-500 text-base mb-10 mt-2">
              <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
                <Mail size={18} />
                <span>{profile.email}</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">

              {/* CONDITIONAL RENDERING: Save vs Edit Button */}
              {isEditing ? (
                <div className="flex-1 flex gap-2">
                  <button
                    onClick={handleSaveClick}
                    className="flex-1 bg-green-600 cursor-pointer text-white py-3.5 rounded-2xl font-medium text-base hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-14 bg-gray-100 cursor-pointer text-slate-600 py-3.5 rounded-2xl font-medium text-base hover:bg-gray-200 transition-all flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="flex-1 bg-slate-900 cursor-pointer text-white py-3.5 rounded-2xl font-medium text-base hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}

              <button className="px-8 py-3.5 border cursor-pointer border-slate-200 text-slate-700 rounded-2xl font-medium text-base hover:bg-slate-50 hover:border-slate-300 transition-all" onClick={() => signOut()}>
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default page
