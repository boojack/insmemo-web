import React from "react";

interface OnlyWhenProps {
  children: React.ReactElement;
  when: boolean;
}

const OnlyWhen: React.FC<OnlyWhenProps> = (props: OnlyWhenProps) => {
  const { children, when } = props;
  return when ? <>{children}</> : null;
};

export default OnlyWhen;
