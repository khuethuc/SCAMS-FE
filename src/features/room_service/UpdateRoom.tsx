"use client"; 

import { useState } from "react";
import { Calendar, Plus, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Card, CardContent} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpdateBookingProps } from "@/type/type";

export default function BookRoom(
  {existingBooking ,onBookingUpdate}: UpdateBookingProps = {}
) {
  const [activeTab, setActiveTab] = useState("book");
  
  const [formData, setFormData] = useState({
    room: existingBooking?.room || "",
    date: existingBooking?.date || "",
    startTime: existingBooking?.startTime || "",
    endTime: existingBooking?.endTime || "",
    courseName: existingBooking?.courseName || "",
    notes: existingBooking?.notes || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    onBookingUpdate?.(
      {
        id: existingBooking?.id || "",
        room: formData.room,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        courseName: formData.courseName,
        notes: formData.notes
      }
    );
    alert("Booking Created!");
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
                  <Select onValueChange={(val) => setFormData({...formData, room: val})}
                    value ={formData.room}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a room..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">Room 101</SelectItem>
                      <SelectItem value="202">Room 202</SelectItem>
                      <SelectItem value="303">Room 303</SelectItem>
                      <SelectItem value="404">Room 404</SelectItem>
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
                <Select onValueChange={(val) => setFormData({...formData, courseName: val})} value={formData.courseName}>
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
                  value ={formData.notes}
                >
                </Textarea>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                <Save className="mr-2 h-5 w-5" /> Update Booking
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