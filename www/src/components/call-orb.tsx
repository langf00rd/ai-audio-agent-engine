import { useEffect, useRef } from "react";

const CallOrb = () => {
  const particlesRef = useRef([]);

  useEffect(() => {
    const animateParticles = () => {
      particlesRef.current.forEach((p) => {
        const angle = parseFloat(p.dataset.angle || Math.random() * 360);
        const speed = parseFloat(p.dataset.speed || 0.2 + Math.random() * 0.3);
        const radius = parseFloat(p.dataset.radius || 30 + Math.random() * 40);

        const newAngle = (angle + speed) % 360;
        const rad = (newAngle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);

        p.style.transform = `translate(${x}px, ${y}px)`;
        p.dataset.angle = newAngle;
      });

      requestAnimationFrame(animateParticles);
    };

    animateParticles();
  }, []);

  const particleCount = 12;

  return (
    <div style={styles.container}>
      {/* <div style={styles.orb}></div> */}
      {[...Array(particleCount)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (particlesRef.current[i] = el)}
          data-angle={Math.random() * 30}
          data-speed={(0.2 + Math.random() * 0.3).toFixed(2)}
          data-radius={(30 + Math.random() * 40).toFixed(2)}
          style={{
            ...styles.particle,
            backgroundColor: `rgba(52, 29, 0, ${0.15 + Math.random() * 0.3})`,
            width: `${4 + Math.random() * 3}px`,
            height: `${4 + Math.random() * 3}px`,
          }}
        />
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    width: 120,
    height: 120,
    margin: "0 auto",
  },
  particle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    borderRadius: "50%",
    transform: "translate(0, 0)",
    transition: "transform 0.1s linear",
  },
};

// Inject keyframes directly
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 20px 6px rgba(52, 29, 0, 0.6);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 30px 10px rgba(52, 29, 0, 0.4);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 20px 6px rgba(52, 29, 0, 0.6);
  }
}`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default CallOrb;
