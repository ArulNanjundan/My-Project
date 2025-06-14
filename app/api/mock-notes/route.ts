import { NextResponse } from 'next/server';

const mockNotes = [
  {
    id: '1',
    title: 'Arulmoorthy Nanjundan',
    content: 'B.E Computer Science and Engineering\nCGPA:7.89',
  },
  {
    id: '2',
    title: 'Projects',
    content: 'Exam Registration\nE-Commerce UI Design\nQuiz using JavaFX',
  },
];

export async function GET() {
  return NextResponse.json({ notes: mockNotes });
}
