"use client"; 

import { useState } from "react";
import { Calendar, Plus, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Card, CardContent} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingProps } from "@/type/type";
import { useRouter } from "next/navigation";

export default function BookRoom(
  {onBookingCreate}: BookingProps = {}
) {
  const [activeTab, setActiveTab] = useState("book");
  const [formData, setFormData] = useState({
    room: "",
    date: "",
    start_time: "",
    end_time: "",
    course_name: "",
    course_id: "",
    notes: ""
  });

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Submitted:", formData);
  //   onBookingCreate?.(
  //     formData.room,
  //     formData.date,
  //     formData.start_time,
  //     formData.end_time,
  //     formData.course_name,
  //     formData.notes
  //   );
  //   alert("Booking Created!");
  // };


  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const courseIds = [
    { name: "Computer Network", id: "CO1001" },
    { name: "Database Management System", id: "CO2002" },
    { name: "Software Engineering", id: "CO3003" },
    { name: "Operating Systems", id: "CO4004" },
  ];

  const switchTab = () => {
    router.push("/");
  }

  function validateForm() {
    if (!formData.room) {
      alert("Please select a room.");
      return false;
    }
    if (!formData.date) {
      alert("Please select a date.");
      return false;
    }
    if (formData.date < new Date().toISOString().split("T")[0]) {
      alert("Date cannot be in the past.");
      return false;
    }
    if (!formData.start_time || !formData.end_time) {
      alert("Please select both start and end times.");
      return false;
    }
    if (formData.start_time >= formData.end_time) {
      alert("End time must be after start time.");
      return false;
    }
    if (!formData.course_name) {
      alert("Please select a course name.");
      return false;
    }
    return true;
  }
  
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); 
    if (!validateForm()) {
      setIsSubmitting(false);
      return; // Stop here! Don't submit.
      }
  
    try {
      // The Network Request
      const apiUrl = "https://ase-251.onrender.com";
      const response = await fetch(`${apiUrl}/rooms/${formData.room}/booking`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "role" : `${localStorage.getItem("userRole") || ""}`,
          },
          body: JSON.stringify({
            user_id: `${localStorage.getItem("userId")}`,
            date: formData.date,
            start_time: formData.start_time,
            end_time: formData.end_time,
            course_id: formData.course_id,
            course_name: formData.course_name,
            notes: formData.notes,
          }),
        });
  
        // 3. Handle Errors (e.g., 400 Bad Request, 500 Server Error)
        if (!response.ok) {
          throw new Error("Failed to create booking");
        }
  
        // 4. Success!
        alert("Booking Successful!");
        router.push("/"); // Redirect user to the schedule page
  
      } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false); // 5. Stop Loading (Unlock the UI)
      }
    };

  return (
    <div className="flex justify-center p-8 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-4xl shadow-lg border-gray-200">
        
        {/* The Tabs Header */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => switchTab()}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors 
              ${activeTab === "schedule" 
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" 
              : "text-gray-500 hover:bg-gray-50"}
            `} 
  
          >
            <Calendar size={18} /> View Schedule
          </button>
          <button
            // onClick={() => setActiveTab("book")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors 
              
              ${activeTab === "book" 
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" 
                : "text-gray-500 hover:bg-gray-50"}`}
          >
            <Plus size={18} /> Book Room
          </button>
        </div>

        <CardContent className="p-8">
          {activeTab === "book" ? (
            <form onSubmit={handleCreateBooking} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Room Selector */}
                <div className="space-y-2">
                  <Label>Select Room</Label>
                  <Select onValueChange={(val) => setFormData({...formData, room: val})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a room..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A-101">Room A-101</SelectItem>
                      <SelectItem value="A-202">Room A-202</SelectItem>
                      <SelectItem value="B-303">Room B-303</SelectItem>
                      <SelectItem value="B-404">Room B-404</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Input */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="time" step="3600" onChange={(e) => setFormData({...formData, start_time: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="time" step="3600" onChange={(e) => setFormData({...formData, end_time: e.target.value})} />
                 </div>
              </div>

              <div className="space-y-2 w-full" >
                <Label>Course Name</Label>
                <Select onValueChange={(val) => {
                    const courseId = courseIds.find(course => course.name === val)?.id || "";
                    setFormData({...formData, course_id: courseId, course_name: val})}}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a course..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Network">Computer Network</SelectItem>
                      <SelectItem value="Database Management System">Database Management System</SelectItem>
                      <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                      <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                    </SelectContent>
                  </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="More details about the booking..."
                  className="h-24"
                >
                </Textarea>
              </div>

              <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                {isSubmitting ? (
                <>Processing...</> 
              ) : (
                <><Save className="mr-2 h-5 w-5" /> Create Booking</>
              )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-20 text-gray-500">
              Schedule view under construction...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}