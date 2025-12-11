"use client"; 

import { useEffect, useState } from "react";
import { Calendar, Plus, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Card, CardContent} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpdateBookingProps } from "@/type/type";
import { useParams, useRouter } from "next/navigation";
import { set } from "date-fns";


export default function BookRoom(
  {onBookingUpdate}: UpdateBookingProps = {}
) {
  const [activeTab, setActiveTab] = useState("book");
  const apiUrl = "http://localhost:8000";
  const [Loading, setLoading] = useState(true);

  const params = useParams();
  const bookingId = params?.id || "";

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    room: "",
    date: "",
    startTime: "",
    endTime: "",
    courseName: "",
    notes: ""
  });
  // ${apiUrl}/booking/${bookingId}
    useEffect(() => {
    async function getExistingBooking() {
      const existingBooking = await fetch(`http://localhost:8000/rooms/booking/book3bc23d2a`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // const something = existingBooking.json();
      console.log("Existing Booking Response:", existingBooking);
      setLoading(false);
      return existingBooking.json();
    }
    getExistingBooking().then((data) => {
      console.log("Fetched Booking Data:", data);
      setFormData({
        id: data.id || "",
        room: data.room_id || "",
        date: data.date || "",
        startTime: data.start_time || "",
        endTime: data.end_time || "",
        courseName: data.course_name || "",
        notes: data.notes || ""
      });
    });
  }, [bookingId]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // await fetch(`${apiUrl}/rooms/${formData.room}/booking/${formData.id}`
    const response = await fetch(`${apiUrl}/rooms/${formData.room}/booking/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "user_id": "6932a72112de6403b5934dac",
        "role" : "lecturer"
      },
      body: JSON.stringify({
        id: formData.id || "",
        room: formData.room,
        date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        course_name: formData.courseName,
        notes: formData.notes
      })
      });
      if (!response.ok) {
          throw new Error("Failed to create booking");
        }
        // 4. Success!
        alert("Update Booking Successful!");
        router.push("/schedule"); // Redirect user to the schedule page
    } catch (error) {
      console.error("Error updating booking:", error);
    }
    finally { 
    setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center p-8 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-4xl shadow-lg border-gray-200">
        
        {/* The Tabs Header */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === "schedule" 
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Calendar size={18} /> View Schedule
          </button>
          <button
            onClick={() => setActiveTab("book")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === "book" 
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Plus size={18} /> Book Room
          </button>
        </div>

        <CardContent className="p-8">
          {activeTab === "book" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Room Selector */}
                <div className="space-y-2">
                  <Label>Select Room</Label>
                  <Select key={formData.room} onValueChange={(val) => setFormData({...formData, room: val})}
                    value ={formData.room}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a room..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A-101">Room A-101</SelectItem>
                      <SelectItem value="A-202">Room A-202</SelectItem>
                      <SelectItem value="B-303">Room B-303</SelectItem>
                      <SelectItem value="B-404">Room B-404</SelectItem>
                      {formData.room && 
                      !["A-101", "A-202", "B-303", "B-404"].includes(formData.room) && (
                          <SelectItem value={formData.room}>
                            {formData.room} 
                          </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Input */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" onChange={(e) => setFormData({...formData, date: e.target.value})} 
                  value={formData.date} />
                </div>
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="time" onChange={(e) => setFormData({...formData, startTime: e.target.value})} 
                    value={formData.startTime} />
                 </div>
                 <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="time" onChange={(e) => setFormData({...formData, endTime: e.target.value})} 
                    value={formData.endTime} />
                 </div>
              </div>

              <div className="space-y-2 w-full" >
                <Label>Course Name</Label>
                <Select key={formData.courseName} onValueChange={(val) => setFormData({...formData, courseName: val})} 
                value={formData.courseName}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a course..." />
                    </SelectTrigger>
                    <SelectContent>
                    
                      <SelectItem value="Computer Network">Computer Network</SelectItem>
                      <SelectItem value="Database Management System">Database Management System</SelectItem>
                      <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                      <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                      {formData.courseName && 
                      !["Computer Network", "Database Management System", "Software Engineering", "Operating Systems"].includes(formData.courseName) && (
                          <SelectItem value={formData.courseName}>
                            {formData.courseName}
                          </SelectItem>
                      )}
                      
                    </SelectContent>
                  </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="More details about the booking..."
                  className="h-24"
                  value ={formData.notes}
                >
                </Textarea>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                {isSubmitting ? (
                <>Processing...</> 
              ) : (
                <><Save className="mr-2 h-5 w-5" /> Update Booking</>
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