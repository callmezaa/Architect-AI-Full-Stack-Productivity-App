import asyncio
import os
import random
from typing import List
from openai import AsyncOpenAI

# Environment variables are now loaded in main.py

class AIService:
    """
    Service for AI interaction. Supports both real OpenAI and Mock mode.
    Tone: Formal Executive Assistant.
    """

    def __init__(self):
        self.use_mock = os.getenv("USE_MOCK_AI", "False").lower() == "true"
        api_key = os.getenv("OPENAI_API_KEY")
        
        # Only initialize OpenAI client if mock mode is OFF
        if not self.use_mock:
            self.client = AsyncOpenAI(api_key=api_key)
        else:
            print("--- AI SERVICE RUNNING IN MOCK MODE ---")
            
        self.model = "gpt-4o-mini"
        self.system_prompt = (
            "You are a Professional Executive Productivity Assistant. "
            "Your tone is formal, efficient, and highly professional. "
            "Your goal is to help the user achieve maximum productivity. "
            "Provide direct, actionable advice."
        )

    async def get_chat_response(self, user_message: str) -> str:
        """
        Interaction logic with fallback to Mock responses.
        """
        if self.use_mock:
            # Simulate "AI is thinking" delay
            await asyncio.sleep(1.2)
            
            # Smart Mock Logic
            msg = user_message.lower()
            if "summarize" in msg or "tugas" in msg:
                return "Berdasarkan tinjauan saya, Anda memiliki 3 tugas tertunda hari ini. Prioritas utama Anda adalah menyelesaikan Laporan Mingguan. Apakah Anda ingin saya menjadwalkan blok waktu fokus untuk itu?"
            elif "plan" in msg or "rencana" in msg:
                return "Saya telah menyusun jadwal pagi Anda secara optimal: 09:00 Deep Work, 10:30 Meeting Sinkronisasi, dan 11:30 Administrasi Ringan. Apakah ini sesuai dengan kapasitas Anda?"
            elif "help" in msg or "bantu" in msg:
                return "Tentu. Saya siap membantu mengoptimalkan alur kerja Anda. Silakan sebutkan tantangan spesifik yang sedang Anda hadapi saat ini."
            
            return f"Terima kasih atas pesan Anda. Saya telah mencatat: '{user_message}'. Sebagai asisten produktivitas, saya menyarankan untuk fokus pada satu tugas prioritas utama terlebih dahulu sebelum beralih ke hal lain. Ada lagi yang bisa saya bantu?"

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return response.choices[0].message.content or "Maaf, saya tidak dapat memproses permintaan Anda saat ini."
        except Exception as e:
            print(f"OpenAI Error: {e}")
            return f"Error: Gagal menghubungi AI. ({str(e)})"

    async def generate_task_suggestions(self, context: str = "general") -> List[dict]:
        """
        Mock or real structured task suggestions.
        """
        if self.use_mock:
            # Predefined high-quality structured suggestions
            all_suggestions = [
                {
                    "id": "1",
                    "title": "Deep Work",
                    "subtitle": "Block 60m for project X",
                    "type": "focus",
                    "action": "FOCUS"
                },
                {
                    "id": "2",
                    "title": "High Priority",
                    "subtitle": "Draft Q4 Presentation",
                    "type": "document",
                    "action": "CREATE_TASK"
                },
                {
                    "id": "3",
                    "title": "Email Sync",
                    "subtitle": "Clear 5 pending replies",
                    "type": "mail",
                    "action": "AI_CHAT"
                },
                {
                    "id": "4",
                    "title": "Review Schedule",
                    "subtitle": "Optimize tomorrow's flow",
                    "type": "calendar",
                    "action": "GO_TO_TASKS"
                },
                {
                    "id": "5",
                    "title": "Take a Break",
                    "subtitle": "Rest for 15 minutes",
                    "type": "break",
                    "action": "FOCUS"
                }
            ]
            return random.sample(all_suggestions, 4)

        try:
            # When using OpenAI, ask for structured JSON
            prompt = (
                "Berdasarkan konteks '{context}', berikan 4 saran produktivitas. "
                "Respon harus berupa JSON array of objects dengan field: "
                "title (singkat), subtitle (deskripsi), type (salah satu dari: focus, document, mail, calendar, break), "
                "dan action (salah satu dari: FOCUS, CREATE_TASK, AI_CHAT, GO_TO_TASKS)."
            )
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=600,
                response_format={"type": "json_object"}
            )
            import json
            content = response.choices[0].message.content or "{}"
            data = json.loads(content)
            suggestions = data.get("suggestions", [])
            # Fill IDs if missing
            for idx, s in enumerate(suggestions):
                s["id"] = str(idx + 1)
            return suggestions[:4]
        except Exception as e:
            print(f"OpenAI Error (Suggestions): {e}")
            return [
                {"id": "1", "title": "Selesaikan Prioritas", "subtitle": "Fokus pada 1 hal utama", "type": "document", "action": "CREATE_TASK"},
                {"id": "2", "title": "Blokir Waktu", "subtitle": "Deep Work 45 menit", "type": "focus", "action": "FOCUS"}
            ]
