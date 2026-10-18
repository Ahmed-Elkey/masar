/** Line drawings of the Egyptian landmarks, matching the reference's circular markers. */
export default function LandmarkIcon({name}:{name:string}) {
  const paths:Record<string,string[]>={
    pyramid:["M5 48L25 12l22 36H5z M25 12l3 36 M28 48l19-10 12 10H28 M39 39l8-17 13 26 M5 51h56","M11 39h12 M16 30h8 M21 21h4 M33 39h8 M30 31h5"],
    museum:["M5 50V30L31 12l28 18v20H5z M5 30h54 M31 12v18 M8 50h48 M12 34v12 M21 34v12 M31 34v12 M41 34v12 M51 34v12 M2 54h60","M12 25h38 M20 20h22 M4 58h56"],
    tower:["M20 55l6-31h12l6 31 M24 24l-4-5h24l-6 5 M21 19v-7h22v7 M27 12V8h10v4 M32 8V2 M16 57h32","M26 27l12 7-14 8 17 7 M38 27l-13 7 15 8-17 7 M28 25l-2 30 M36 25l2 30 M23 15h18"],
    citadel:["M5 55h54 M10 55V36h44v19 M23 36a9 9 0 0 1 18 0 M32 27V14 M32 14l3 3-3 3 M9 36V15h6v21 M7 15l5-8 5 8 M49 36V15h6v40 M47 15l5-8 5 8","M25 55V43a7 7 0 0 1 14 0v12 M17 39v9 M47 39v9 M10 23h5 M49 23h6 M20 36v-6h5 M39 30h5v6"],
    plane:["M6 36l21-6 8-21c1-3 4-4 5-1l-3 21 18 10v4l-20-4-6 13 5 4v3l-10-4-8 2v-3l7-6 3-11-20 3v-4z","M4 55h14 M43 55h17"],
    mall:["M6 54V27h52v27H6z M4 27l9-12h38l9 12 M10 27v8 M19 27v8 M28 27v8 M37 27v8 M46 27v8 M55 27v8 M10 35h45 M24 54V40h16v14","M10 40h10v9H10z M44 40h10v9H44z M20 15V8h24v7 M25 11h14 M3 58h58"],
  };
  return <svg width="38" height="38" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{(paths[name]??paths.mall).map((d,i)=><path key={i} d={d}/>)}</svg>;
}
