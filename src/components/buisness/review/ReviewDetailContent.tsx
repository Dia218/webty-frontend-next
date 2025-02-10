import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'absolute',
    top: '15vh',
    left: '3vw',
    right: '5vw',
    bottom: '5vh',
    zIndex: 20,
  },
  transparentBox: {
    position: 'absolute',
    left: '4%',
    top: '4%',
    width: '60%',
    height: '88%',
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 0, 0, 0.5)',
    borderRadius: '8px',
  },
  darkBox1: {
    position: 'absolute',
    width: '33.33%',
    height: '40%',
    backgroundColor: '#9CA3AF',
    top: '25%', // 원하는 위치로 조정
    left: '3%', // 원하는 위치로 조정
  },
  darkBox2: {
    position: 'absolute',
    width: '33.33%',
    height: '40%',
    backgroundColor: '#9CA3AF',
    top: '25%', // 원하는 위치로 조정
    left: '40%', // 원하는 위치로 조정
  },
  circle: {
    position: 'absolute',
    width: '9%', // Ensure width and height are equal
    height: '10%',
    backgroundColor: '#6B7280', // Slightly lighter gray
    borderRadius: '50%', // Ensures the shape is a circle
    top: '22%', // Position above darkBox1
    left: '3%',
    transform: 'translateY(-100%)', 
  },
  horizontalLine: {
    position: 'absolute',
    left: '4%',
    width: '94%',
    top: '96%',
    borderTop: '1px solid rgba(0, 0, 0, 0.5)',
  },
};

const ReviewDetailContent: React.FC = () => {
    return (
      <div style={styles.container}>
        <div style={styles.transparentBox}>
          <div style={styles.darkBox1} />
          <div style={styles.darkBox2} />
          <div style={styles.circle} />
        </div>
        <div style={styles.horizontalLine} />
      </div>
    );
  };
  
  export default ReviewDetailContent;