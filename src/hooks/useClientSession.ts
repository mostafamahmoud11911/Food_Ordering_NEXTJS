import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useClientSession(initialSession: Session | null) {
  const { data: session, status } = useSession();
  const [currentSession, setCurrentSession] = useState(initialSession);

  useEffect(() => {
    if (initialSession) {
      setCurrentSession(initialSession);
    }
  }, [initialSession]);
  useEffect(() => {
    if (session) {
      setCurrentSession(session);
    }
  }, [session]);
  return { data: currentSession, status };
}
