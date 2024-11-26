interface TagPosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

const getTagPosition = (
  n: number,
  position: TagPosition
): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  const offset = n * 8.5;

  if (position.top !== undefined) styles.top = `${offset}px`;
  if (position.right !== undefined) styles.right = `${position.right}px`;
  if (position.bottom !== undefined) styles.bottom = `${offset}px`;
  if (position.left !== undefined) styles.left = `${position.left}px`;

  return styles;
};

const tagComponents: Record<string, (n: number) => React.ReactNode> = {
  max: () => (
    <div className="size-2.5 bg-black relative" style={{
      clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
    }}>
      <div className="absolute inset-[1px] bg-yellow-200" style={{
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
      }}>
        <div className="absolute inset-[1px] bg-yellow-600" style={{
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
        }} />
      </div>
    </div>
  ),
};

export const Tag = ({ tag, n }: { tag: string; n: number }) => {
  const TagComponent = tagComponents[tag.toLowerCase()];

  if (!TagComponent) return null;

  return (
    <div className="absolute z-10" style={getTagPosition(n, { top: 0, right: 0 })}>
      {TagComponent(n)}
    </div>
  );
};
