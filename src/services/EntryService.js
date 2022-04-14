export async function getEntries(url) {
    try {
      const res = await fetch(url);
      return res.json();
    } catch (err) {
      console.log(err)
    }
  }