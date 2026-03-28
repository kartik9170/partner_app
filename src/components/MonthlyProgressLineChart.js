import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { P } from '../theme/partnerTokens';

const DEFAULT_VALUES = [42, 68, 94, 58];

/**
 * Line chart for weekly performance (W1–W4). Matches partner mint / green theme.
 */
export default function MonthlyProgressLineChart({
  values = DEFAULT_VALUES,
  activeIndex = 2,
  height = 132,
  horizontalPadding = 8,
}) {
  const [width, setWidth] = useState(0);

  const { linePath, areaPath, points } = useMemo(() => {
    if (width <= 0) {
      return { linePath: '', areaPath: '', points: [] };
    }

    const padT = 14;
    const padB = 6;
    const innerW = width - horizontalPadding * 2;
    const innerH = height - padT - padB;
    const n = values.length;
    const minV = Math.min(...values) * 0.85;
    const maxV = Math.max(...values) * 1.05;
    const span = Math.max(maxV - minV, 1);

    // X at quarter centers so points align with W1–W4 labels below
    const xs = values.map((_, i) => horizontalPadding + (innerW * (i + 0.5)) / n);
    const ys = values.map((v) => padT + innerH * (1 - (v - minV) / span));

    let lineD = `M ${xs[0]} ${ys[0]}`;
    for (let i = 1; i < n; i += 1) {
      lineD += ` L ${xs[i]} ${ys[i]}`;
    }

    const baseY = padT + innerH;
    let areaD = `M ${xs[0]} ${baseY} L ${xs[0]} ${ys[0]}`;
    for (let i = 1; i < n; i += 1) {
      areaD += ` L ${xs[i]} ${ys[i]}`;
    }
    areaD += ` L ${xs[n - 1]} ${baseY} Z`;

    const pts = xs.map((x, i) => ({ x, y: ys[i], i }));

    return { linePath: lineD, areaPath: areaD, points: pts };
  }, [width, height, values, horizontalPadding]);

  const gridLines = useMemo(() => {
    if (width <= 0) return [];
    const padT = 14;
    const innerH = height - padT - 6;
    return [0.25, 0.5, 0.75].map((t) => ({
      y: padT + innerH * t,
      key: t,
    }));
  }, [width, height]);

  return (
    <View style={{ height }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="mpLineFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={P.secondary} stopOpacity="0.22" />
              <Stop offset="1" stopColor={P.secondary} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {gridLines.map(({ y, key }) => (
            <Line
              key={key}
              x1={horizontalPadding}
              y1={y}
              x2={width - horizontalPadding}
              y2={y}
              stroke={P.outlineVariant}
              strokeOpacity={0.35}
              strokeWidth={1}
            />
          ))}

          {areaPath ? <Path d={areaPath} fill="url(#mpLineFill)" /> : null}
          {linePath ? (
            <Path
              d={linePath}
              fill="none"
              stroke={P.secondary}
              strokeWidth={2.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {points.map(({ x, y, i }) => {
            const active = i === activeIndex;
            return (
              <Circle
                key={i}
                cx={x}
                cy={y}
                r={active ? 6 : 4}
                fill={P.surfaceContainerLowest}
                stroke={P.secondary}
                strokeWidth={active ? 2.5 : 2}
              />
            );
          })}
        </Svg>
      )}
    </View>
  );
}
