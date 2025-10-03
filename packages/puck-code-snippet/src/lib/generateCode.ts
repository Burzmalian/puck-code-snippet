import type { Data, Config, PuckContext } from "@measured/puck";
import { format } from "prettier";
import estree from "prettier/plugins/estree";
import ts from "prettier/plugins/typescript.js";
import { createElement, ReactElement, Fragment } from "react";
import reactElementToJSXString from "react-element-to-jsx-string";

interface ComponentItem {
  type: string;
  props: Record<string, unknown>;
}

const mockPuckContext: PuckContext = {
  renderDropZone: () => null,
  isEditing: false,
  metadata: {},
  dragRef: null,
};

function cloneElementWithExpandedContent(element: ReactElement, nestedElements: ReactElement[]): ReactElement {
  // If this element has children, recursively process them
  const props = element.props as { children?: unknown };
  const children = props.children;

  if (!children) {
    return element;
  }

  // Check if children is the Content component (function component)
  if (typeof children === 'object' && children !== null && 'type' in children && typeof children.type === 'function') {
    // Replace the Content component with the actual nested elements
    return createElement(
      element.type,
      { ...(props as Record<string, unknown>), children: undefined },
      ...nestedElements
    );
  }

  // If children is an array, recursively process each child
  if (Array.isArray(children)) {
    const processedChildren = children.map(child => {
      if (typeof child === 'object' && child !== null && 'type' in child && typeof child.type === 'function') {
        return nestedElements;
      }
      if (typeof child === 'object' && child !== null && 'type' in child) {
        return cloneElementWithExpandedContent(child as ReactElement, nestedElements);
      }
      return child;
    }).flat();

    return createElement(
      element.type,
      { ...(props as Record<string, unknown>), children: undefined },
      ...processedChildren
    );
  }

  return element;
}

function generateComponentElement(item: ComponentItem, config: Config): ReactElement {
  const { type, props } = item;

  const componentConfig = config.components[type];
  if (!componentConfig) {
    return createElement("div", null, `Unknown component: ${type}`);
  }

  // Check if component has slot content
  const content = props.content as ComponentItem[] | undefined;

  if (content && content.length > 0) {
    // Recursively process nested components to get React elements
    const nestedElements = content.map((item) => generateComponentElement(item, config));

    // Create mock Content component that renders the nested elements
    const mockContentComponent = () => {
      return createElement(Fragment, null, ...nestedElements);
    };

    const mockProps = {
      ...props,
      id: String(props.id || ""),
      puck: mockPuckContext,
      editMode: false,
      content: mockContentComponent,
    };

    const renderedElement = componentConfig.render(mockProps);

    // Expand the Content component to show actual nested elements
    return cloneElementWithExpandedContent(renderedElement, nestedElements);
  }

  // Render the component with its props
  const mockProps = {
    ...props,
    id: String(props.id || ""),
    puck: mockPuckContext,
    editMode: false,
  };

  return componentConfig.render(mockProps);
}

function generateComponentJSX(item: ComponentItem, config: Config): string {
  const element = generateComponentElement(item, config);
  return reactElementToJSXString(element, {
    showDefaultProps: false,
    showFunctions: false,
  });
}

export async function generateReactCode(
  data: Data,
  config: Config
): Promise<string> {
  const { content } = data;

  if (!content || content.length === 0) {
    return "no page content";
  }

  const componentsCode = content
    .map((item) => generateComponentJSX(item as ComponentItem, config))
    .join("\n");

  const unformattedCode = `export default function Page() {
  return (
    <>
      ${componentsCode}
    </>
  );
}`;

  try {
    const formatted = await format(unformattedCode, {
      plugins: [ts, estree],
      parser: "typescript",
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: "es5",
    });

    return formatted;
  } catch (error) {
    console.error("Failed to format code:", error);
    return unformattedCode;
  }
}
