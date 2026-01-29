"use client";
import { useState } from "react";
import axios from "axios";
import { useAuths } from "./useAuths";

export interface Message {
    id?: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at?: string;
}

export const useChatbot = () => {
    const { accessToken } = useAuths();
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<number | null>(null);

    const askAdvisor = async (message: string) => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/chatbot/sessions/ask/`,
                {
                    message,
                    session_id: sessionId
                },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (res.data.session_id) {
                setSessionId(res.data.session_id);
            }

            return res.data.message as Message;
        } catch (error) {
            console.error("Chatbot Error:", error);
            return {
                role: 'assistant',
                content: "I'm having trouble connecting to my knowledge base. Please try again later."
            } as Message;
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (id?: number) => {
        if (!accessToken) return [];
        const targetId = id || sessionId;
        if (!targetId) return [];

        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/chatbot/sessions/${targetId}/`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            return res.data.messages as Message[];
        } catch (error) {
            console.error("History Fetch Error:", error);
            return [];
        }
    };

    return {
        loading,
        sessionId,
        setSessionId,
        askAdvisor,
        fetchHistory
    };
};
