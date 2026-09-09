export const Pendulum = () => {
  return (
    <>
      {/* Floating rotating diamonds */}
      <div className="ani-vector">
        <span></span>
        <span></span>
      </div>

      {/* Swinging pendulum clock */}
      <div className="pendulums">
        <div className="pendulum">
          <div className="bar"></div>
          <div className="motion">
            <div className="string"></div>
            <div className="weight"></div>
          </div>
        </div>
      </div>
    </>
  );
};
