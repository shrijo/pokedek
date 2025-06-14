import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function Home() {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchExps = async () => {
      const { data, error } = await supabase.from("experiences").select("*");
      if (!error) setExperiences(data || []);
    };
    fetchExps();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Pokedek Experiences</h1>
      <ul style={{ marginTop: 12 }}>
        {experiences.map((exp) => (
          <li key={exp.id} style={{ marginBottom: 8 }}>
            <Link to={`/experience/${exp.id}/receiver`}>{exp.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
