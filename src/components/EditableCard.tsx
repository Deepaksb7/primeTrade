"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface Props {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => void;
  onCancel?: () => void;
}

const EditableCard = ({
  initialTitle = "",
  initialContent = "",
  onSave,
  onCancel,
}: Props) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  return (
    <Card className="relative flex h-full w-full flex-col overflow-hidden border-zinc-900 bg-white shadow-lg ring-1 ring-zinc-900/5 transition-all">
      <div className="flex flex-1 flex-col gap-3 p-5 min-h-0">
        <input
          type="text"
          placeholder="Card Title"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          className="w-full shrink-0 bg-transparent text-lg font-bold leading-tight text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
        />
        
        <textarea
          placeholder="Start typing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full resize-none bg-transparent text-sm leading-relaxed text-zinc-600 placeholder:text-zinc-300 focus:outline-none"
        />
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-zinc-100 bg-zinc-50 p-3 absolute w-full bottom-0">
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-white hover:text-zinc-900 hover:shadow-sm"
          >
            <X size={14} />
            Cancel
          </button>
        )}
        <button
          onClick={() => onSave(title, content)}
          className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
        >
          <Check size={14} />
          Save
        </button>
      </div>
    </Card>
  );
};

export default EditableCard;