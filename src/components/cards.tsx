"use client";
import { Card } from "@/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";

interface Props {
  title: string;
  content: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const Cards = ({ title, content, onEdit, onDelete }: Props) => {
  return (
    <Card className="relative flex h-full min-h-[240px] w-full flex-col overflow-hidden border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md">
      
      <div className="flex flex-1 flex-col p-5 min-h-0">
        <div className="mb-3 text-lg font-bold leading-tight text-zinc-900">
          {title}
        </div>
        <div className="flex-1 overflow-y-auto text-sm leading-relaxed text-zinc-600 whitespace-pre-wrap scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
          {content}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-zinc-100 bg-zinc-50 p-3 absolute bottom-0 w-full">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-white hover:text-zinc-900 hover:shadow-sm hover:ring-1 hover:ring-zinc-200"
            >
              <Edit2 size={14} />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
        </div>
      )}
    </Card>
  );
};

export default Cards;