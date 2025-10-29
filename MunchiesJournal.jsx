import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function MunchiesJournal({ topic, onSubmit }) {
  const [formData, setFormData] = useState({
    favorite_moment: "",
    how_felt_after: "",
    finished_plate: null,
    got_seconds: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.favorite_moment || !formData.how_felt_after || formData.finished_plate === null || formData.got_seconds === null) {
      alert("Please fill out all fields!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="border-2 border-[#66bfad]/30 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-[#1165b3] text-center" style={{ fontFamily: 'Poppins' }}>
          📝 Meal Journal
        </CardTitle>
        <p className="text-center text-gray-600">Earn 50 XP + 10 Coins!</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#e0f8f5] rounded-lg p-4">
            <p className="text-sm font-semibold text-[#1165b3]">Topic Discussed:</p>
            <p className="text-gray-800">{topic.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="favorite_moment" className="text-lg font-semibold text-gray-800">
              My Favorite Moment
            </Label>
            <Textarea
              id="favorite_moment"
              value={formData.favorite_moment}
              onChange={(e) => setFormData({...formData, favorite_moment: e.target.value})}
              placeholder="What was your favorite part of this meal?"
              className="min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="how_felt_after" className="text-lg font-semibold text-gray-800">
              How I Felt After
            </Label>
            <Textarea
              id="how_felt_after"
              value={formData.how_felt_after}
              onChange={(e) => setFormData({...formData, how_felt_after: e.target.value})}
              placeholder="How did your body feel after eating?"
              className="min-h-24"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-semibold text-gray-800">Did you finish your plate?</Label>
            <RadioGroup
              value={formData.finished_plate === null ? undefined : formData.finished_plate.toString()}
              onValueChange={(val) => setFormData({...formData, finished_plate: val === 'true'})}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="finished-yes" />
                <Label htmlFor="finished-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="finished-no" />
                <Label htmlFor="finished-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-semibold text-gray-800">Did you get seconds?</Label>
            <RadioGroup
              value={formData.got_seconds === null ? undefined : formData.got_seconds.toString()}
              onValueChange={(val) => setFormData({...formData, got_seconds: val === 'true'})}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="seconds-yes" />
                <Label htmlFor="seconds-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="seconds-no" />
                <Label htmlFor="seconds-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white py-6 text-lg rounded-2xl"
            style={{ fontFamily: 'Poppins' }}
          >
            Submit Journal (+50 XP, +10 Coins)
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}