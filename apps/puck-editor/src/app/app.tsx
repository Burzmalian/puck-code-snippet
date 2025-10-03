import { Puck, type Config, Data, Slot } from "@measured/puck";
import "@measured/puck/puck.css";
import { ReactNode, useState } from "react";
import { createPlugin } from "puck-code-snippet";

type Props = {
  HeadingBlock: { children: string };
  MadsButton: { children: string };
  Example: { content: Slot };
};

const MadsButton = ({ children }: { children: ReactNode }) => {
  return <button>{children}</button>;
};

// Create Puck component config
const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        children: {
          type: "text",
        },
      },
      render: ({ children }) => {
        return <h1>{children}</h1>;
      },
    },
    MadsButton: {
      fields: {
        children: {
          type: "text",
        },
      },
      render: ({ children }) => {
        return <MadsButton>{children}</MadsButton>;
      },
    },
    Example: {
      fields: {
        content: {
          type: "slot",
        },
      },
      render: ({ content: Content }) => {
        return (
          <div>
            <Content minEmptyHeight={60} />
          </div>
        );
      },
    },
  },
};

// Describe the initial data
const initialData = {
  content: [],
  root: {},
};

export function App({ children }: { children: ReactNode }) {
  const [currentData, setCurrentData] = useState<Data>(initialData);

  return (
    <Puck
      config={config}
      data={currentData}
      onChange={setCurrentData}
      plugins={[createPlugin({ data: currentData, config: config })]}
    >
      {children}
    </Puck>
  );
}

export default App;
