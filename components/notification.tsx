import Image from "next/image";

interface NotificationProps {
  name: string;
  action: string;
  action_occurred: string;
  sub_action?: string;
  id: number;
  className: string;
  isRead: boolean;
  imagePath: string;
  subImagePath: string;

  handleClick: (id: number) => void;
}

export default function Notification(props: NotificationProps) {
  const {
    name,
    action,
    action_occurred,
    sub_action,
    isRead,
    id,
    imagePath,
    subImagePath,
    handleClick,
  } = props;

  return (
    <div
      onClick={() => handleClick(id)}
      className={isRead ? "notification-wrapper read" : "notification-wrapper"}
    >
      <Image alt={name} src={`${imagePath}`} width={45} height={45} />
      <div className="inner-content">
        {" "}
        <div className="inner-content-string">
          <span className="name font-weight--bold">{name}</span>{" "}
          <span className="action">{action}</span>{" "}
          {!isRead ? <span className="dot"></span> : null}
        </div>
        <div className="action-occurred">{action_occurred}</div>
        {sub_action ? <div className="sub-action">{sub_action}</div> : null}
      </div>
      {subImagePath ? (
        <Image
          className="ml-auto"
          alt={name}
          src={`${subImagePath}`}
          width={45}
          height={45}
        />
      ) : null}
    </div>
  );
}
