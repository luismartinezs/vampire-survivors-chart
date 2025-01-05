import { Fragment } from "react";
import { Item } from "./Item";
import { Tag } from "./Tag";
import { TItem } from "@/data/types";

interface ResponsiveItemProps {
  item: TItem;
  tags?: string[];
}

export function ResponsiveItem({ item, tags }: ResponsiveItemProps) {
  return (
    <div className="relative">
      {tags?.map((tag: string, idx: number) => (
        <Fragment key={idx}>
          <Tag tag={tag} n={idx} size="xs" className="sm:hidden" />
          <Tag tag={tag} n={idx} size="sm" className="hidden sm:block" />
        </Fragment>
      ))}
      <Item item={item} size="xs" className="sm:hidden" />
      <Item item={item} size="sm" className="hidden md:hidden sm:block" />
      <Item item={item} size="sm" className="hidden md:block" />
    </div>
  );
}