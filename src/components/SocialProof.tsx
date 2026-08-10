import Image from "next/image";

const FACES = [
  { src: "/faces/face1.jpg", alt: "Early Wodoo member" },
  { src: "/faces/face2.jpg", alt: "Early Wodoo member" },
  { src: "/faces/face3.jpg", alt: "Early Wodoo member" },
  { src: "/faces/face4.jpg", alt: "Early Wodoo member" },
];

type SocialProofProps = {
  count: number;
};

function formatCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}

export function SocialProof({ count }: SocialProofProps) {
  return (
    <div className="social-proof-block">
      <div className="social-proof">
        <div className="avatar-stack" aria-hidden="true">
          {FACES.map((face, index) => (
            <Image
              key={face.src}
              src={face.src}
              alt={face.alt}
              width={36}
              height={36}
              className="avatar"
              style={{ zIndex: index + 1 }}
            />
          ))}
        </div>
        <p className="social-proof-text">
          <strong>{formatCount(count)}+</strong> people already waiting
        </p>
      </div>
      <p className="social-proof-note">
        Early members get lifetime premium features and help shape what Wodoo
        becomes. No spam, unsubscribe anytime.
      </p>
    </div>
  );
}
