import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

type RoomProps = {
  title: string;
  roomOwner: string;
  questions: QuestionType[];
};
export function useRoom(roomId: string): RoomProps {
  const { user } = useAuth();
  const [roomProps, setRoom] = useState({} as RoomProps);
  const questions = roomProps?.questions || [];
  const title = roomProps?.title || "";
  const roomOwner = roomProps?.roomOwner || "";
  console.log("useRoom");
  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    // listeners
    function parseQuestions(questions: FirebaseQuestions) {
      return Object.entries(questions).map(([key, value]) => {
        const likeList = value.likes ?? {};
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(likeList).length,
          likeId: Object.entries(likeList).find(
            ([, like]) => like.authorId === user?.id
          )?.[0],
        };
      });
    }
    roomRef.on("child_changed", (room, prevChildKey) => {
      console.log("child change", prevChildKey);
      const databaseQuestion = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseQuestion ?? {};
      const parsedQuestions: QuestionType[] = parseQuestions(firebaseQuestions);
      setRoom({
        title: title,
        roomOwner: roomOwner,
        questions: parsedQuestions,
      });
    });
    roomRef.once("value", (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestions: QuestionType[] = parseQuestions(firebaseQuestions);
      setRoom({
        title: databaseRoom.title,
        roomOwner: databaseRoom.authorId,
        questions: parsedQuestions,
      });
    });
    return () => {
      roomRef.off();
    };
  }, [roomId, user?.id, title, roomOwner]);

  return { questions, title, roomOwner };
}
