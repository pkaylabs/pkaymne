import React, { FC, ReactElement } from 'react';

interface ListProps<T = any> {
  data: T[];
  renderItem: (data: T) => ReactElement;
  renderEmptyComponent?: () => ReactElement;
  selected?: boolean;
}

const List: FC<ListProps> = ({ data, renderItem, renderEmptyComponent }) => {
  if (!data || data.length === 0) {
    return <div>{renderEmptyComponent ? renderEmptyComponent() : 'N/A'}</div>;
  }

  return (
    <>
      {data.map((item, index) => (
        <div className='w-full flex flex-col ' key={index}>
          {renderItem(item)}
        </div>
      ))}
    </>
  );
};

export default List;
