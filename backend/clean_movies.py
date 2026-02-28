import pandas as pd
import json

# Load dataset
df = pd.read_csv("tmdb_5000_movies.csv")

# Keep required columns
df = df[[
    "title",
    "genres",
    "popularity",
    "vote_average",
    "vote_count",
    "overview"
]]

# Convert genres JSON string to list
def extract_genres(genre_str):
    try:
        genres = json.loads(genre_str.replace("'", '"'))
        return [g["name"] for g in genres]
    except:
        return []

df["genres"] = df["genres"].apply(extract_genres)

# Fill missing values
df["overview"] = df["overview"].fillna("")
df["popularity"] = df["popularity"].fillna(0)
df["vote_average"] = df["vote_average"].fillna(0)
df["vote_count"] = df["vote_count"].fillna(0)

# Convert to list of dictionaries
movies_list = df.to_dict(orient="records")

# Save cleaned JSON
with open("movies_cleaned.json", "w", encoding="utf-8") as f:
    json.dump(movies_list, f, indent=2)

print("Upgraded dataset saved as movies_cleaned.json")