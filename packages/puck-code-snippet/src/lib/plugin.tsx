import { type Data, IconButton, Config } from "@measured/puck";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { generateReactCode } from "./generateCode";
import { Code, Copy, X, Check } from "lucide-react";

interface DialogProps {
  data: Data;
  config: Config;
}

const Dialog = ({ data, config }: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [code, setCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateReactCode(data, config).then(setCode);
  }, [data, config]);

  const handleClick = () => {
    dialogRef.current?.showModal();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <IconButton title="View Code" onClick={handleClick}>
        <Code />
      </IconButton>
      <dialog
        /* @ts-expect-error missing closedby attribute */
        closedby="any"
        ref={dialogRef}
        style={{
          borderRadius: "4px",
          border: "1px solid var(--puck-color-grey-09)",
          padding: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            justifyContent: "end",
            paddingBottom: "8px",
          }}
        >
          <IconButton
            title={copied ? "Copied!" : "Copy"}
            onClick={handleCopy}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </IconButton>
          <IconButton title="Close" onClick={() => dialogRef.current?.close()}>
            <X size={16} />
          </IconButton>
        </div>
        <pre
          style={{
            padding: "12px",
            background: "var(--puck-color-grey-11)",
            borderRadius: "4px",
            margin: "0",
            fontFamily: "monospace",
          }}
        >
          {code}
        </pre>
      </dialog>
    </>
  );
};

export const createPlugin = ({
  data,
  config,
}: {
  data: Data;
  config: Config;
}) => ({
  overrides: {
    headerActions: ({ children }: { children: ReactNode }) => {
      return (
        <>
          <Dialog data={data} config={config} />
          {children}
        </>
      );
    },
  },
});
