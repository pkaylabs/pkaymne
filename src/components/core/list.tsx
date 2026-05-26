import React, { ReactElement } from 'react';

interface ListProps<T = unknown> {
  data: T[];
  renderItem: (data: T) => ReactElement;
  renderEmptyComponent?: () => ReactElement;
  selected?: boolean;
}

const List = <T,>({ data, renderItem, renderEmptyComponent }: ListProps<T>) => {
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
