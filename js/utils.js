const collision = ({ firstObj, secondObj }) => {
  return (
    firstObj.position.y + firstObj.height >= secondObj.position.y &&
    firstObj.position.y <= secondObj.position.y + secondObj.height &&
    firstObj.position.x <= secondObj.position.x + secondObj.width &&
    firstObj.position.x + firstObj.width >= secondObj.position.x
  );
};

const platformCollision = ({ firstObj, secondObj }) => {
  return (
    firstObj.position.y + firstObj.height >= secondObj.position.y &&
    firstObj.position.y + firstObj.height <= secondObj.position.y + secondObj.height &&
    firstObj.position.x <= secondObj.position.x + secondObj.width &&
    firstObj.position.x + firstObj.width >= secondObj.position.x
  );
};
