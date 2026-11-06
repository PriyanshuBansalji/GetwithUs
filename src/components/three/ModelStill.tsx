import type { ReactNode } from "react";
import type { ModelKey } from "@/components/three/models/keys";

/*
 * The still drawing for each page model: what the panel shows before WebGL
 * loads (and for good, without WebGL). Flat shapes in the theme's tokens, so
 * they follow the theme toggle with no script.
 */

/** The folders model's colours (Folders.tsx): ink folders behind a teal one. */
const FOLDER_COLORS = ["var(--ink)", "var(--ink)", "var(--ink)", "var(--accent)"];

const S = { fill: "var(--card)", stroke: "var(--line-2)", strokeWidth: 1.5 } as const;

function Ring({
  cx = 200,
  cy = 150,
  rx = 165,
  ry = 44,
}: {
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill="none"
      stroke="var(--accent)"
      strokeOpacity={0.5}
      strokeWidth={1.5}
    />
  );
}

const STILLS: Record<ModelKey, ReactNode> = {
  "brand-cube": (
    <>
      <Ring cy={160} rx={170} ry={46} />
      <path d="M200 72 L264 106 L200 140 L136 106 Z" {...S} />
      <path
        d="M136 106 L200 140 L200 214 L136 180 Z"
        fill="var(--bg-soft)"
        stroke={S.stroke}
        strokeWidth={1.5}
      />
      <path
        d="M264 106 L200 140 L200 214 L264 180 Z"
        fill="var(--card-2)"
        stroke={S.stroke}
        strokeWidth={1.5}
      />
      <path d="M216 150 L248 133 L248 167 L216 184 Z" fill="var(--accent)" />
      <path d="M152 133 L184 150 L184 184 L152 167 Z" fill="var(--accent)" opacity={0.85} />
      <circle cx={368} cy={166} r={6} fill="var(--amber)" />
      <circle cx={96} cy={196} r={6} fill="var(--amber)" />
    </>
  ),
  "glass-browser": (
    <>
      {[0, 1, 2, 3].map((index) => (
        <rect
          key={index}
          x={70 + index * 22}
          y={56 + index * 16}
          width={220}
          height={150}
          rx={12}
          fill={index === 3 ? "var(--card)" : "var(--accent)"}
          fillOpacity={index === 3 ? 0.92 : 0.08 + index * 0.06}
          stroke="var(--line-2)"
          strokeWidth={1.5}
        />
      ))}
      <circle cx={152} cy={122} r={4} fill="#f26b5b" />
      <circle cx={165} cy={122} r={4} fill="#f5b54a" />
      <circle cx={178} cy={122} r={4} fill="#3ec27a" />
      <rect x={150} y={146} width={90} height={12} rx={4} fill="var(--ink)" />
      <rect x={150} y={166} width={64} height={7} rx={3} fill="var(--line)" />
      <rect x={150} y={186} width={56} height={16} rx={8} fill="var(--accent)" />
      <rect x={262} y={146} width={70} height={56} rx={8} fill="var(--accent-soft)" />
    </>
  ),
  "phone-screens": (
    <>
      <rect x={150} y={40} width={100} height={210} rx={20} fill="var(--ink)" />
      <rect x={158} y={50} width={84} height={190} rx={14} fill="var(--card)" />
      <rect x={170} y={84} width={44} height={8} rx={3} fill="var(--ink)" />
      <rect x={170} y={108} width={60} height={20} rx={6} {...S} />
      <rect x={170} y={136} width={60} height={20} rx={6} {...S} />
      <rect x={170} y={170} width={60} height={22} rx={11} fill="var(--accent)" />
      <rect
        x={232}
        y={66}
        width={110}
        height={36}
        rx={10}
        fill="var(--card)"
        stroke="var(--line-2)"
        strokeWidth={1.5}
      />
      <rect x={242} y={76} width={16} height={16} rx={4} fill="var(--accent)" />
      <rect x={266} y={78} width={60} height={6} rx={3} fill="var(--ink)" />
      <rect x={266} y={89} width={40} height={5} rx={2} fill="var(--line)" />
    </>
  ),
  "node-graph": (
    <>
      <Ring rx={150} ry={52} />
      {[
        [62, 150, "var(--wa)"],
        [130, 196, "var(--c-ai)"],
        [270, 196, "var(--c-web)"],
        [338, 150, "var(--c-mob)"],
        [200, 102, "var(--c-data)"],
      ].map(([x, y, color]) => (
        <g key={`${x}-${y}`}>
          <line x1={200} y1={150} x2={x} y2={y} stroke="var(--line-2)" strokeWidth={1.5} />
          <rect
            x={Number(x) - 16}
            y={Number(y) - 16}
            width={32}
            height={32}
            rx={8}
            fill={String(color)}
          />
        </g>
      ))}
      <circle cx={200} cy={150} r={30} fill="var(--accent)" />
      <circle cx={146} cy={174} r={5} fill="var(--amber)" />
      <circle cx={262} cy={151} r={5} fill="var(--amber)" />
    </>
  ),
  "phone-bubbles": (
    <>
      <rect x={130} y={40} width={100} height={210} rx={20} fill="var(--ink)" />
      <rect x={138} y={50} width={84} height={190} rx={14} fill="var(--wa)" fillOpacity={0.18} />
      <rect x={138} y={50} width={84} height={24} rx={10} fill="var(--wa)" />
      {[
        [170, 92, 120, false],
        [214, 130, 110, true],
        [184, 168, 96, false],
        [228, 206, 120, true],
      ].map(([x, y, w, mine]) => (
        <rect
          key={`${x}-${y}`}
          x={Number(x)}
          y={Number(y)}
          width={Number(w)}
          height={26}
          rx={12}
          fill={mine ? "var(--wa)" : "var(--card)"}
          stroke="var(--line-2)"
          strokeWidth={1}
        />
      ))}
    </>
  ),
  "handset-rings": (
    <>
      {[60, 95, 130].map((r, index) => (
        <circle
          key={r}
          cx={200}
          cy={150}
          r={r}
          fill="none"
          stroke="var(--c-ai)"
          strokeOpacity={0.5 - index * 0.14}
          strokeWidth={2}
        />
      ))}
      <g transform="rotate(-38 200 150)">
        <rect x={190} y={92} width={20} height={116} rx={10} fill="var(--accent)" />
        <rect x={176} y={84} width={34} height={26} rx={10} fill="var(--accent)" />
        <rect x={176} y={190} width={34} height={26} rx={10} fill="var(--accent)" />
      </g>
    </>
  ),
  funnel: (
    <>
      {[
        [80, 320, 96, "var(--c-mkt)"],
        [116, 284, 140, "var(--c-web)"],
        [146, 254, 184, "var(--accent)"],
        [170, 230, 228, "var(--ok)"],
      ].map(([left, right, y, color]) => {
        const l = Number(left);
        const r = Number(right);
        const top = Number(y) - 30;
        return (
          <path
            key={String(color)}
            d={`M${l} ${top} L${r} ${top} L${r - 16} ${top + 30} L${l + 16} ${top + 30} Z`}
            fill={String(color)}
            fillOpacity={0.45}
            stroke={String(color)}
            strokeWidth={1.5}
          />
        );
      })}
      {[
        [190, 40],
        [214, 56],
        [200, 78],
        [204, 252],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={4} fill="var(--amber)" />
      ))}
    </>
  ),
  "server-hub": (
    <>
      {[96, 132, 168].map((y) => (
        <g key={y}>
          <rect x={60} y={y} width={120} height={28} rx={6} {...S} />
          <circle cx={76} cy={y + 14} r={3.5} fill="var(--ok)" />
          <circle cx={88} cy={y + 14} r={3.5} fill="var(--accent)" />
        </g>
      ))}
      {[110, 146, 182].map((y) => (
        <path
          key={y}
          d={`M180 ${y} C 220 ${y} 230 150 262 150`}
          fill="none"
          stroke="var(--line-2)"
          strokeWidth={2}
        />
      ))}
      <rect x={262} y={124} width={52} height={52} rx={12} fill="var(--accent)" />
      {[
        [350, 92, "var(--c-web)"],
        [362, 158, "var(--c-mob)"],
        [340, 214, "var(--c-mkt)"],
      ].map(([cx, cy, color]) => (
        <g key={`${cx}-${cy}`}>
          <line x1={314} y1={150} x2={cx} y2={cy} stroke="var(--line-2)" strokeWidth={2} />
          <circle cx={cx} cy={cy} r={12} fill={String(color)} />
        </g>
      ))}
    </>
  ),
  "services-turntable": (
    <>
      <ellipse cx={200} cy={200} rx={170} ry={46} {...S} />
      {[
        [90, 176, "var(--c-web)"],
        [150, 150, "var(--c-mob)"],
        [250, 150, "var(--c-data)"],
        [310, 176, "var(--c-mkt)"],
        [200, 204, "var(--accent)"],
      ].map(([x, y, color]) => (
        <rect
          key={`${x}-${y}`}
          x={Number(x) - 26}
          y={Number(y) - 52}
          width={52}
          height={52}
          rx={10}
          fill={String(color)}
          fillOpacity={0.85}
        />
      ))}
    </>
  ),
  "process-path": (
    <>
      {[
        [80, 210],
        [160, 180],
        [240, 150],
        [320, 120],
      ].map(([x, y], index) => (
        <g key={x}>
          <path
            d={`M${x - 40} ${y} L${x} ${y - 18} L${x + 40} ${y} L${x} ${y + 18} Z`}
            fill={index === 3 ? "var(--accent)" : "var(--card)"}
            stroke="var(--line-2)"
            strokeWidth={1.5}
          />
          <path
            d={`M${x - 40} ${y} L${x - 40} ${y + 14} L${x} ${y + 32} L${x + 40} ${y + 14} L${x + 40} ${y} L${x} ${y + 18} Z`}
            fill="var(--line)"
          />
        </g>
      ))}
      <circle cx={320} cy={92} r={9} fill="var(--amber)" />
    </>
  ),
  "about-cube": (
    <>
      <Ring rx={170} ry={46} cy={156} />
      <path d="M200 70 L268 106 L200 142 L132 106 Z" {...S} />
      <path
        d="M132 106 L200 142 L200 222 L132 186 Z"
        fill="var(--bg-soft)"
        stroke={S.stroke}
        strokeWidth={1.5}
      />
      <path
        d="M268 106 L200 142 L200 222 L268 186 Z"
        fill="var(--card-2)"
        stroke={S.stroke}
        strokeWidth={1.5}
      />
      <path d="M216 154 L250 136 L250 172 L216 190 Z" fill="var(--accent)" />
      <path d="M150 136 L184 154 L184 190 L150 172 Z" fill="var(--accent)" opacity={0.85} />
      {[
        [56, 150],
        [330, 176],
        [300, 120],
        [96, 196],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 34} y={y - 11} width={68} height={22} rx={11} {...S} />
      ))}
    </>
  ),
  folders: (
    <>
      {FOLDER_COLORS.map((color, index) => (
        <g key={index} transform={`rotate(${(index - 1.5) * 9} 200 250)`}>
          <rect x={120} y={92 - index * 4} width={44} height={14} rx={4} fill={color} />
          <rect x={120} y={102 - index * 4} width={160} height={110} rx={8} fill={color} />
          <rect x={132} y={118 - index * 4} width={136} height={84} rx={4} fill="var(--card)" />
        </g>
      ))}
    </>
  ),
  "folders-closed": (
    <>
      {FOLDER_COLORS.map((color, index) => (
        <g key={index}>
          <rect x={120 + index * 6} y={92 - index * 8} width={44} height={14} rx={4} fill={color} />
          <rect
            x={120 + index * 6}
            y={102 - index * 8}
            width={160}
            height={110}
            rx={8}
            fill={color}
          />
          <rect
            x={132 + index * 6}
            y={118 - index * 8}
            width={136}
            height={84}
            rx={4}
            fill="var(--card)"
          />
        </g>
      ))}
    </>
  ),
  "device-frame": (
    <>
      <rect x={70} y={60} width={260} height={180} rx={12} {...S} />
      <rect x={70} y={60} width={260} height={22} rx={10} fill="var(--line)" />
      <rect x={84} y={96} width={232} height={130} rx={6} fill="var(--accent-soft)" />
    </>
  ),
  "paper-plane": (
    <>
      <ellipse
        cx={200}
        cy={150}
        rx={160}
        ry={60}
        fill="none"
        stroke="var(--accent)"
        strokeOpacity={0.4}
        strokeDasharray="6 8"
        strokeWidth={1.5}
      />
      <rect x={140} y={110} width={120} height={80} rx={6} {...S} />
      <path d="M140 112 L200 156 L260 112" fill="none" stroke="var(--line-2)" strokeWidth={1.5} />
      <circle cx={200} cy={166} r={8} fill="var(--accent)" />
      <path d="M300 92 L352 76 L322 112 L314 98 Z" fill="var(--accent)" />
    </>
  ),
  "assembling-cube": (
    <>
      <path
        d="M200 70 L268 106 L200 142 L132 106 Z"
        fill="none"
        stroke="var(--accent)"
        strokeOpacity={0.5}
        strokeDasharray="5 6"
        strokeWidth={1.5}
      />
      <path
        d="M132 106 L200 142 L200 222 L132 186 Z"
        fill="var(--card)"
        stroke={S.stroke}
        strokeWidth={1.5}
      />
      <path
        d="M268 106 L200 142 L200 222 L268 186 Z"
        fill="none"
        stroke="var(--accent)"
        strokeOpacity={0.5}
        strokeDasharray="5 6"
        strokeWidth={1.5}
      />
    </>
  ),
  shield: (
    <>
      <path
        d="M200 52 C230 66 260 70 284 70 C284 150 260 200 200 240 C140 200 116 150 116 70 C140 70 170 66 200 52 Z"
        fill="var(--accent)"
      />
      <path
        d="M168 146 L192 170 L236 122"
        fill="none"
        stroke="var(--card)"
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  "legal-document": (
    <>
      <rect x={156} y={58} width={130} height={176} rx={8} fill="var(--line)" />
      <rect x={136} y={46} width={130} height={176} rx={8} {...S} />
      <rect x={154} y={70} width={60} height={9} rx={3} fill="var(--ink)" />
      {[96, 112, 128, 144, 160].map((y, index) => (
        <rect
          key={y}
          x={154}
          y={y}
          width={index % 3 === 2 ? 64 : 94}
          height={6}
          rx={3}
          fill="var(--line)"
        />
      ))}
      <circle cx={234} cy={196} r={12} fill="var(--accent)" />
    </>
  ),
  "drifting-cube": (
    <>
      <ellipse
        cx={170}
        cy={180}
        rx={120}
        ry={32}
        fill="none"
        stroke="var(--accent)"
        strokeOpacity={0.45}
        strokeWidth={1.5}
      />
      <g transform="rotate(14 280 100)">
        <path d="M280 56 L318 76 L280 96 L242 76 Z" {...S} />
        <path
          d="M242 76 L280 96 L280 140 L242 120 Z"
          fill="var(--bg-soft)"
          stroke={S.stroke}
          strokeWidth={1.5}
        />
        <path
          d="M318 76 L280 96 L280 140 L318 120 Z"
          fill="var(--card-2)"
          stroke={S.stroke}
          strokeWidth={1.5}
        />
        <path d="M290 104 L308 94 L308 114 L290 124 Z" fill="var(--accent)" />
      </g>
    </>
  ),
};

/** The still drawing of a page model, at the panel's 4:3. */
export default function ModelStill({ model }: { model: ModelKey }) {
  return (
    <svg viewBox="0 0 400 300" className="h-auto w-[86%]" aria-hidden="true" focusable="false">
      {STILLS[model]}
    </svg>
  );
}
