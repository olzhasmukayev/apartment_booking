import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  shadow?: boolean;
  direction?: "col" | "row";
  justify?: "between" | "around" | "center";
}

const Container: React.FC<ContainerProps> = ({
  children,
  shadow,
  direction = "",
}) => {
  const styles = `px-4 lg:px-6 py-3 w-full ${shadow ? "shadow" : ""} flex ${
    "flex-" + direction
  } justify-between`;

  return <div className={styles}>{children}</div>;
};

export default Container;
